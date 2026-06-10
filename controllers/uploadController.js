import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file received",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    await fs.unlink(req.file.path);

    res.json({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch {}
    }

    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};
