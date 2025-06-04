// app/register/actions/signupAction.js
"use server";

import axios from "axios";

export async function signupAction(formData) {
  try {
    // 1) Await the Axios POST. Axios throws on non-2xx.
    const response = await axios.post(
      `${process.env.BASE_URL || ""}/api/create-user`,
      formData
    );

    // 2) If we reach here, status is 2xx. Return success + the response data.
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // 3) Axios error: this might be a 4xx/5xx from your API or a network failure.
    console.error("Signup error:", error);

    // If the server sent a JSON error with a `message` field, read it:
    const message =
      error.response?.data?.message ||
      error.response?.data?.msg ||
      error.message ||
      "Signup failed. Please try again.";

    return {
      success: false,
      message,
    };
  }
}
