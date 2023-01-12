import express from "express";
import {
  loginController,
  productController,
  refreshController,
  registerController,
  userController,
} from "../controllers";
import verifyToken from "../middlewares/token/verifyToken";
import admin from "../middlewares/admin";

const router = express.Router();
/*-------------------------Users------------------------------- */
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", verifyToken, userController.user);
router.post("/refresh", refreshController.refresh);
router.post("/logout", verifyToken , loginController.logout);

/*-------------------------Products------------------------------- */
router.post('/product', [verifyToken, admin] , productController.addProduct);
router.put('/product/:id', [verifyToken, admin] , productController.updateProduct);
router.delete('/product/:id', [verifyToken, admin] , productController.deleteProduct);
router.get('/products' , productController.allProducts);
router.get('/product/:id' , productController.singleProducts);

export default router;
