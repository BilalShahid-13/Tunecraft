"use server";

import axios from "axios";

export default async function getNotificationCount() {
  try {
    const notifcations = await axios.get(`${process.env.BASE_URL}/api/notification/getAllPending`)
    if (notifcations.status === 200) {
      const data = notifcations.data.data;
      const newNotifications = data.map((items) => (
        {
          orderName: items.musicTemplate,
          submittedAtTime: items.submittedAtTime,
          createdAt: items.updatedAt,
          approvalStatus: items.approvalStatus,
          status: "Crafter Registration",
          crafterId: items?.crafterId,
          _id: items._id,
          username: items.username,
          role: items.role,
        }
      ))
      return newNotifications;
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}
