import Notification from "../models/Notification.js";

// Get all notifications for the logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to the most recent 20
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id }, // Security check
      { isRead: true },
      { new: true }
    );
    if (!notification)
      return res
        .status(404)
        .json({ message: "Notification not found or not owned by user." });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification." });
  }
};
