import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized());
  }
  const token = authHeader.split(" ")[1];
  try {
    const { _id, role } = await JwtService.verify(token);

    const user = {
      _id,
      role,
    };
    req.user = user;
    next();
  } catch (err) {
    next(CustomErrorHandler.unAuthorized());
  }
};
export default verifyToken;
