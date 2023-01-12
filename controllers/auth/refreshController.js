import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // check inside database;
    let refreshToken;
    let userId;

    try {
      refreshToken = await RefreshToken.findOne({ token: req.body.token });

      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }

      try {
        const { _id } = await JwtService.verify(
          refreshToken.token,
          REFRESH_SECRET
        );
        userId = _id;

        const user = await User.findOne({ id: userId });

        if (!user) {
          return next(CustomErrorHandler.unAuthorized("No user found"));
        }

        const access_token = JwtService.sign({
          _id: user._id,
          role: user.role,
        });

        const refresh_token = JwtService.sign(
          { _id: user._id, role: user.role },
          "1y",
          REFRESH_SECRET
        );

        await RefreshToken.create({
          token: refresh_token,
        });

        res.status(201).json({
          access_token,
          refresh_token,
        });
        
      } catch (err) {
        return next(err.message);
      }
      
    } catch (err) {
      return next(new Error("Something went wrong"));
    }
  },
};

export default refreshController;
