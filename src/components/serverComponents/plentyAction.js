"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function plentyAction() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  try {
    // Make API call to fetch the plenty count using fetch
    const response = await fetch(
      `${process.env.BASE_URL}/api/get-crafter-plenties`,
      {
        method: "POST", // Use POST method for sending data
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          userId: session.user.id,
          role: session.user.role,
        }), // Send the userId and role as JSON
      }
    );

    // Check if the response is successful
    if (response.ok) {
      const data = await response.json(); // Parse the response as JSON
      console.log("Plenty count data:", data);
      return {
        plenty: data.data, // Assuming 'data' contains the plenty count
      };
    } else {
      console.error("Error in fetching plenty:", response.status);
      return {
        plenty: null, // Return null if the response is not OK
      };
    }
  } catch (error) {
    console.error("Error fetching plenty:", error);
    return {
      plenty: null, // Return null in case of error
    };
  }
}
