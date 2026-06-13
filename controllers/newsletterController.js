import Subscriber from "../models/Subscriber.js";


export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    const subscriber = await Subscriber.create({ email });

    return res.status(201).json(subscriber);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });

    return res.status(200).json(subscribers);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};