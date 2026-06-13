import User from "../models/User.js";
import Product from "../models/Product.js";
import Subscriber from "../models/Subscriber.js"

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const usersToday = await User.countDocuments({
      createdAt: {
        $gte: startOfDay,
      },
    });

    const subscribersToday = await Subscriber.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    res.json({
      totalUsers,
      totalProducts,
      totalSubscribers,
      usersToday,
      subscribersToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting another admin (optional safety)
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Cannot delete admin user",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
