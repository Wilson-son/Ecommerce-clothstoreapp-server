import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

     const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    generateToken(res, user._id);

    res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, user._id);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await sendMail({
      email: user.email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });
  } catch (error) {
    console.error("Forgot password error →", error); // ← full error in terminal
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email",
    });
  }
};

export const resetPassword = async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;

  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
};

export const logoutUser = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};



export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    console.log("Current User:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
