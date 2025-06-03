"use server";

import { _crafterStatus } from "@/lib/utils";
import axios from "axios";
export default async function fetchAllCrafterTask() {
  try {
    const res = await axios.get(`${process.env.BASE_URL}/api/admin/get-all-Crafters`)
    if (res.status === 200) {
      const allCrafters = res.data.data;
      const newNotifications = allCrafters.map((items) => (
        {
          orderName: items.musicTemplate,
          createdAt: items?.matchedCrafters[0]?.submittedAtTime,
          updatedAt: items?.updatedAt,
          approvalStatus: _crafterStatus(items?.matchedCrafters[0].submissionStatus).label,
          status: "Task Submission",
          orderId: items?.orderId,
          _id: items?.matchedCrafters[0].assignedCrafterId._id,
          username: items?.name,
          role: items?.matchedCrafters[0].assignedCrafterId.role,
        }
      ))
      return {
        notification: newNotifications,
        allUser: { users: res.data.data, mode: "task", task: res.data.data },
        isUpdateTask: false
      }
    }
  } catch (error) {
    console.error(error);
    return []
  }
}
