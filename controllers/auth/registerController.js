import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { RefreshToken, User } from "../../models";
import bcrypt from "bcryptjs";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const registerController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .max(50)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const isRegistered = await User.exists({ email: req.body.email });
      if (isRegistered) {
        return next(
          CustomErrorHandler.alreadyRegistered(
            "User with this email already registered"
          )
        );
      }
    } catch (err) {
      return next(err);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const { name, email } = req.body;
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    let access_token;
    let refresh_token;
    let user;
    try {
      user = await newUser.save();
      access_token = JwtService.sign({ _id: user._id, role: user.role });
      refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      await RefreshToken.create({
        token: refresh_token,
      });
    } catch (err) {
      return next(err);
    }

    res.json({ access_token, refresh_token });
  },
};

export default registerController;
