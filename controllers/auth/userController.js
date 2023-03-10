import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userController = {
  async user(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select('-password  -updatedAt  -__v');
      if(!user){
       return next(CustomErrorHandler.notFound())
      }

      res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
