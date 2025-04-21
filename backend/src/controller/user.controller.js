import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const getUserByUserId = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const buyPremiumSuccess = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    console.log(req.auth);
    if (userId) {
      const userUpdate = await User.updateOne(
        { clerkId: userId },
        { $set: { isPremium: true } }
      );
      if (!userUpdate) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ userUpdate, message: "Premium status updated" });
    }
    res.status(200).json({ message: "Premium status updated" });
  } catch (error) {
    next(error);
  }
};
