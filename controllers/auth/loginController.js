import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcryptjs";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const loginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .max(50)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isPasswordMatch) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      const access_token = JwtService.sign({ _id: user._id, role: user.role });

      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );

      await RefreshToken.create({
        token: refresh_token,
      });

      res.status(200).json({ access_token, refresh_token });
    } catch (err) {
      next(err);
    }
  },

  /* --------------Logout-------------------*/
  async logout(req , res , next){
    
    const refreshSchema = Joi.object({
      token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    

    if (error) {
      return next(error);
    }
    
    try{
      await RefreshToken.deleteOne({token : req.body.token});

       res.status(200).json("Logged out successfuly");      
       
    }catch(err){
      return next(new Error(err.message));
    }
    
  }
};

export default loginController;
