export default async function handler(req, res) {
  try {
    await cronJobFunction(); // Manually trigger your cron job function here
    res.status(200).json({ message: "Cron job triggered manually" });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger cron job" });
  }
}
