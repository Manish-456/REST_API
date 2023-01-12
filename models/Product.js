import mongoose from "mongoose";
import { APP_URL } from "../config";

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      required: true,
      get: (image) => {
        return `${APP_URL}/${image}`;
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true
    },
    id : false
  }
);

export default mongoose.model("Product", ProductSchema);
