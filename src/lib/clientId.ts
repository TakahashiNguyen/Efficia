/**
 * Generate a unique client ID for WebRTC connections
 */
export function generateClientId(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijklmnopqrstuvwxyz23456789"; // Removed confusing chars (0, O, 1, I)
  let result = "";
  for (let i = 1; i < 15; i++) {
    if (i % 5 == 0) result += "-";
    else result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
