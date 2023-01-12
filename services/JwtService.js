import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

class JwtService {
  static sign(payload, expiry = "60s", secretkey = JWT_SECRET) {
   return jwt.sign(payload , secretkey, {
    expiresIn: expiry
   })
  }

  static verify(token ,  secretkey= JWT_SECRET ){
    return jwt.verify(token , secretkey )
  }
}

export default JwtService