const { zokou } = require("../framework/zokou");
const fetch = require("node-fetch");
const yt = require("@dark-yasiya/yt-dl.js");

// 🎶 Play Command
zokou({
    pattern: "play",
    alias: ["ytplay", "ytvideo"],
    react: "🎶",
    desc: "Download YouTube video by search query",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a search term.\n\nExample: *.play despacito*");

        // 🔎 Search YouTube
        let results = await yt.search(q);
        if (!results || results.length < 1) return reply("❌ No results found.");

        let yts = results[0]; // First result

        // 🌐 API for video download
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the video. Please try again later.");
        }

        // 📝 Video Details
        let ytmsg = `📹 *YouTube Video Downloader*
        
🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ LEONARD-MD* 💥`;

        // 🎥 Send video with caption
        await conn.sendMessage(
            from,
            {
                video: { url: data.result.download_url },
                caption: ytmsg,
                mimetype: "video/mp4"
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
