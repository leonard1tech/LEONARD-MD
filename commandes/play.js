const { zokou } = require("../framework/zokou");
const set = require("../set"); 
const DY_SCRAP = require("@dark-yasiya/scrap");
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

zokou(
    {
        nomCom: "play", 
        alias: ["mp3", "ytmp3"],
        categorie: "download",
        reaction: "🎧",
        desc: "Download Ytmp3",
        use: ".ply <text or url>",
        filename: __filename
    },
    async (dest, zk, commandeOptions) => {
        const { repondre, arg, ms } = commandeOptions;

        try {
            if (!arg || arg.length === 0) 
                return await repondre("❌ Please provide a song name or keywords.\nExample: `.play despacito`");

            await repondre("🎧 *Searching for your song...*");

            const q = arg.join(" ");
            let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

            if (!id) {
                const searchResults = await dy_scrap.ytsearch(q);
                if (!searchResults?.results?.length) 
                    return await repondre("❌ No results found!");
                id = searchResults.results[0].videoId;
            }

            const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
            if (!data?.results?.length) 
                return await repondre("❌ Failed to fetch video!");

            const { url, title, image, timestamp, ago, views, author } = data.results[0];

            let info = ☢️ *LEONARD MD DOWNLOADER* ☢️\n\n +
                🎵 *Title:* ${title || "Unknown"}\n +
                ⏳ *Duration:* ${timestamp || "Unknown"}\n +
                👀 *Views:* ${views || "Unknown"}\n +
                🌏 *Release Ago:* ${ago || "Unknown"}\n +
                👤 *Author:* ${author?.name || "Unknown"}\n +
                🖇 *Url:* ${url || "Unknown"}\n\n +
                🔽 *Reply with your choice:*\n +
                1.1 *Audio Type* 🎵\n` +
                1.2 *Document Type* 📁\n\n +
                ${set.FOOTER || "> *Leonard Tech in fire ☢️*"};

            const sentMsg = await zk.sendMessage(dest, { image: { url: image }, caption: info }, { quoted: ms });
            const messageID = sentMsg.key.id;
            await zk.sendMessage(dest, { react: { text: '🎶', key: sentMsg.key } });

            zk.ev.on("messages.upsert", async (messageUpdate) => {
                try {
                    const mekInfo = messageUpdate?.messages[0];
                    if (!mekInfo?.message) return;

                    const messageType = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                    const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                    if (!isReplyToSentMsg) return;

                    let userReply = messageType.trim();
                    let msg;
                    let type;
                    let response;

                    if (userReply === "1.1") {
                        msg = await zk.sendMessage(dest, { text: "⏳ Processing..." }, { quoted: ms });
                        response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                        let downloadUrl = response?.result?.download?.url;
                        if (!downloadUrl) return await repondre("❌ Download link not found!");
                        type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };

                    } else if (userReply === "1.2") {
                        msg = await zk.sendMessage(dest, { text: "⏳ Processing..." }, { quoted: ms });
                        response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                        let downloadUrl = response?.result?.download?.url;
                        if (!downloadUrl) return await repondre("❌ Download link not found!");
                        type = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title };

                    } else {
                        return await repondre("❌ Invalid choice! Reply with 1.1 or 1.2.");
                    }

                    await zk.sendMessage(dest, type, { quoted: ms });
                    await zk.sendMessage(dest, { text: "✅ Upload Successful ✅", edit: msg.key });

                    // **Send your channel promotion message**
                    await zk.sendMessage(dest, {
                        text: "🔥 Check out my channel! 🔥",
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "120363419863942379@newsletter",
                                newsletterName: "LEONARD-MD",
                                serverMessageId: -1
                            }
                        }
                    }, { quoted: ms });

                } catch (error) {
                    console.error(error);
                    await repondre(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
                }
            });

        } catch (error) {
            console.error(error);
            await repondre(`❌ *An error occurred:* ${error.message || "Error!"}`);
        }
    }
);