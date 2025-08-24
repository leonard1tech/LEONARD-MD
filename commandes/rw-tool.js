const { zokou } = require("../framework/zokou");
const axios = require("axios");

// VCard Contact (B.M.B VERIFIED ✅)
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "LEONARD VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:LEONARD TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862487:+255767862457\nEND:VCARD"
    }
  }
};

// Newsletter context
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "LEONARD MD",
      serverMessageId: 1
    }
  }
};

zokou({
  pattern: "rw",
  alias: ["randomw", "wallpaper"],
  react: "🌌",
  desc: "Download random wallpapers based on keywords.",
  category: "wallpapers",
  use: ".rw <keyword>",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  try {
    const query = args.join(" ") || "random";
    const apiUrl = `https://pikabotzapi.vercel.app/random/randomwall/?apikey=anya-md&query=${encodeURIComponent(query)}`;

    const { data } = await axios.get(apiUrl);

    if (data.status && data.imgUrl) {
      const caption = `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🌌 *Random Wallpaper: ${query}*
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ > *© Powered by 𝙻𝙴𝙾𝙽𝙰𝚁𝙳 𝚃𝙴𝙲𝙷*
┗━━━━━━━━━━━━━━━━━━━━━━━`;

      await conn.sendMessage(from, {
        image: { url: data.imgUrl },
        caption,
        ...newsletterContext
      }, { quoted: quotedContact });

    } else {
      reply(`❌ No wallpaper found for *"${query}"*.`);
    }
  } catch (error) {
    console.error("Wallpaper Error:", error);
    reply("❌ An error occurred while fetching the wallpaper. Please try again.");
  }
});
