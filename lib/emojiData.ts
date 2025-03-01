import emojilib from "emojilib"

// Convert emojilib data to our format
export const allEmojis = Object.entries(emojilib).map(([emoji, data]) => ({
  emoji,
  name: Array.isArray(data) ? data[0] : data,
  keywords: Array.isArray(data) ? data.slice(1) : [],
}))

