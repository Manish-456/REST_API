import path from "path";
import { Product } from "../../models";
import multer from "multer";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import fs from "fs";
import productSchema from "../../validators/productValidator";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${new Date().getTime()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: {
    fileSize: 100000 * 5,
  },
}).single("image");

const productController = {
  async addProduct(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      // validation
      const filePath = req.file.path;

      const { error } = productSchema.validate(req.body);
      if (error) {
        // delete the uploaded file;

        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });

        return next(error);
      }

      let document;

      try {
        document = await Product.create({
          ...req.body,
          image: filePath,
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async updateProduct(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      // validation
      let filePath;
      if (req.file) {
        filePath = req.file.path;
      }

      const { error } = productSchema.validate(req.body);
      if (error) {
        // delete the uploaded file;
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });

        return next(error);
      }
      let document;

      try {
        document = await Product.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
          {
            $set: req.body,
          },
          {
            new: true,
          }
        );
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async deleteProduct(req, res, next) {
    const product = await Product.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!product) {
      return next(new Error("Nothing to delete !"));
    }

    // image delete
    const imagePath = product._doc.image; // by doing _doc, getter method won't call and we get our original url
    console.log(imagePath)
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
      res.status(200).json("Product has been deleted!");
    });
  },

  async allProducts(req, res, next) {
    let products;
    try {
      products = await Product.find()
        .select("-updatedAt -__v ")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.status(200).json(products);
  },
  async singleProducts(req, res, next) {
    let products;
    try {
      products = await Product.findById({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.status(200).json(products);
  },
};

export default productController;
