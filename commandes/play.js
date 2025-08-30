const config = require("../framework/zokou");
const { zokou } = require("../framework/zokou");
const { ytsearch } = require("@dark-yasiya/yt-dl.js");

// MP4 video download

zokou({ 
    nomCom: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    filename: __filename 
}, async (dest, zk, commandeOptions) => {
    const { arg, msg } = commandeOptions;
    const query = arg.join(" ").trim();

    try { 
        if (!q) return await reply("Please provide a YouTube URL or video name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `📹 *Video Downloader*
🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👀 *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ LEONARD-MD* 💥`;

        // Send video directly with caption
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
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});

// MP3 song download 

zokou({ 
    nomCom: "song", 
    alias: ["play", "mp3"], 
    react: "🎧", 
    desc: "Download YouTube song", 
    category: "main",
    filename: __filename 
}, async (dest, zk, commandeOptions) => {
    const { arg, msg } = commandeOptions;
    const query = arg.join(" ").trim();

    if (!query) {
        return await zk.sendMessage(dest, { text: "*Please provide search keywords.*" }, { quoted: msg });
    }

    try {
        if (!q) return reply("Please provide a song name or YouTube link.");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();


        if (!data?.result?.downloadUrl) return reply("Download failed. Try again later.");

    await zk.sendMessage(from, {
    audio: { url: data.result.downloadUrl },
    mimetype: "audio/mpeg",
    fileName: `${song.title}.mp3`,
    contextInfo: {
        externalAdReply: {
            title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
            body: "Join our WhatsApp Channel",
            mediaType: 1,
            thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
            sourceUrl: 'https://whatsapp.com/channel/0029VbBAqgd4inooNwRQ4K0J',
            mediaUrl: 'https://whatsapp.com/channel/0029VbBAqgd4inooNwRQ4K0J',
            showAdAttribution: true,
            renderLargerThumbnail: true
        }
    }
}, { quoted: msg });

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});
