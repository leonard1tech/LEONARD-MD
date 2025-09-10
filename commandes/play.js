import fetch from 'node-fetch';
import ytSearch from 'yt-search';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import os from 'os';
import config from '../config.cjs';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

function toFancyFont(text) {
  const fontMap = {
    'a': 'ᴀ',
    'b': 'ʙ',
    'c': 'ᴄ',
    'd': 'ᴅ',
    'e': 'ᴇ',
    'f': 'ғ',
    'g': 'ɢ',
    'h': 'ʜ',
    'i': 'ɪ',
    'j': 'ᴊ',
    'k': 'ᴋ',
    'l': 'ʟ',
    'm': 'ᴍ',
    'n': 'ɴ',
    'o': 'ᴏ',
    'p': 'ᴘ',
    'q': 'ǫ',
    'r': 'ʀ',
    's': 's',
    't': 'ᴛ',
    'u': 'ᴜ',
    'v': 'ᴠ',
    'w': 'ᴡ',
    'x': 'x',
    'y': 'ʏ',
    'z': 'ᴢ'
  };
  
  return text.toLowerCase().split('').map(char => fontMap[char] || char).join('');
}

const streamPipeline = promisify(pipeline);
const tmpDir = os.tmpdir();

// Function to get YouTube thumbnail URL
function getYouTubeThumbnail(videoId, quality = 'hqdefault') {
  const qualities = {
    'default': 'default.jpg',
    'mqdefault': 'mqdefault.jpg',
    'hqdefault': 'hqdefault.jpg',
    'sddefault': 'sddefault.jpg',
    'maxresdefault': 'maxresdefault.jpg'
  };
  
  return `https://i.ytimg.com/vi/${videoId}/${qualities[quality] || qualities['hqdefault']}`;
}

// Function to extract YouTube video ID from URL
function extractYouTubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : false;
}

// Custom reaction function
async function sendCustomReaction(client, message, reaction) {
  try {
    // Get the message key of the quoted message or the original message
    const key = message.quoted ? message.quoted.key : message.key;
    
    // Send reaction to the message
    await client.sendMessage(key.remoteJid, {
      react: {
        text: reaction,
        key: key
      }
    });
  } catch (error) {
    console.error("Error sending reaction:", error.message);
  }
}

const play = async (message, client) => {
  try {
    const prefix = config.Prefix || config.PREFIX || '.';
    const body = message.body || '';
    const command = body.startsWith(prefix) ? body.slice(prefix.length).split(" ")[0].toLowerCase() : '';
    const args = body.slice(prefix.length + command.length).trim().split(" ");
    
    // Send a custom reaction when the play command is detected
    if (command === "play") {
      // Send a loading reaction
      await sendCustomReaction(client, message, "⏳");
      
      if (args.length === 0 || !args.join(" ")) {
        // Send error reaction
        await sendCustomReaction(client, message, "❌");
        return await client.sendMessage(message.from, {
          text: toFancyFont("Please provide a song name or keywords to search"),
          viewOnce: true,
          mentions: [message.sender]
        }, { quoted: message });
      }
      
      const query = args.join(" ");
      
      const searchResults = await ytSearch(query);
      
      if (!searchResults.videos || searchResults.videos.length === 0) {
        // Send error reaction
        await sendCustomReaction(client, message, "❌");
        return await client.sendMessage(message.from, {
          text: toFancyFont('No tracks found for') + " \"" + query + "\"",
          viewOnce: true,
          mentions: [message.sender]
        }, { quoted: message });
      }
      
      // Send a searching reaction
      await sendCustomReaction(client, message, "🔍");
      
      const video = searchResults.videos[0];
      const fileName = video.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 100);
      const filePath = tmpDir + '/' + fileName + ".mp3";
      
      let apiResponse;
      
      try {
        const apiUrl = "https://apis.davidcyriltech.my.id/play?query=" + encodeURIComponent(query);
        apiResponse = await fetch(apiUrl);
        
        if (!apiResponse.ok) {
          throw new Error("API responded with status: " + apiResponse.status);
        }
        
        const apiData = await apiResponse.json();
        
        if (!apiData.status || !apiData.result?.download_url) {
          throw new Error("API response missing download URL or failed");
        }
        
        // Extract YouTube video ID from URL
        const videoId = extractYouTubeId(video.url) || video.videoId;
        
        // Get YouTube thumbnail URL
        const thumbnailUrl = getYouTubeThumbnail(videoId, 'maxresdefault');
        
        // Format duration correctly
        const minutes = Math.floor(video.duration.seconds / 60);
        const seconds = video.duration.seconds % 60;
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Create the song info display
        const songInfo = `
 ━❍ *SONG*❍━
🎵 *Title:* ${video.title}

👤 *Artist:* ${video.author.name}
⏱️ *Duration:* ${formattedDuration}
📅 *Published:* ${video.ago}
👁️ *Views:* ${video.views.toLocaleString()}
📥 *Format:* MP3
        `.trim();
        
        // Create buttons with Menu and Join Channel options
        const buttons = [
          {
            buttonId: prefix + 'menu',
            buttonText: { displayText: "📋 Menu" },
            type: 1
          },
          {
            buttonId: prefix + 'join channel',
            buttonText: { displayText: "📢 Join Channel" },
            type: 1
          }
        ];
        
        // Download thumbnail image
        let imageBuffer = null;
        try {
          const imageResponse = await fetch(thumbnailUrl);
          if (imageResponse.ok) {
            const arrayBuffer = await imageResponse.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
          }
        } catch (imageError) {
          console.error("Failed to download thumbnail:", imageError.message);
        }
        
        // Send message with image if available, otherwise text only
        if (imageBuffer) {
          const imageMessage = {
            image: imageBuffer,
            caption: songInfo,
            buttons: buttons,
            headerType: 4,
            viewOnce: true,
            mentions: [message.sender]
          };
          
          await client.sendMessage(message.from, imageMessage, { quoted: message });
        } else {
          const buttonMessage = {
            text: songInfo,
            buttons: buttons,
            headerType: 1,
            viewOnce: true,
            mentions: [message.sender]
          };
          
          await client.sendMessage(message.from, buttonMessage, { quoted: message });
        }
        
        // Send a downloading reaction
        await sendCustomReaction(client, message, "⬇️");
        
        const audioResponse = await fetch(apiData.result.download_url);
        
        if (!audioResponse.ok) {
          throw new Error("Failed to download audio: " + audioResponse.status);
        }
        
        const fileStream = fs.createWriteStream(filePath);
        await streamPipeline(audioResponse.body, fileStream);
        
      } catch (apiError) {
        console.error("API error:", apiError.message);
        // Send error reaction
        await sendCustomReaction(client, message, "❌");
        
        return await client.sendMessage(message.from, {
          text: "*GALAXY-MD* " + toFancyFont("couldn't process your request. Please try again later"),
          viewOnce: true,
          mentions: [message.sender]
        }, { quoted: message });
      }
      
      try {
        // Send audio file
        const audioData = fs.readFileSync(filePath);
        
        // Send success reaction before sending audio
        await sendCustomReaction(client, message, "✅");
        
        await client.sendMessage(message.from, { 
          audio: audioData, 
          mimetype: 'audio/mpeg',
          ptt: false,
          fileName: fileName + ".mp3"
        }, { quoted: message });
        
        // Clean up temp file
        setTimeout(() => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log("Deleted temp file: " + filePath);
            }
          } catch (cleanupError) {
            console.error("Error during file cleanup:", cleanupError);
          }
        }, 5000);
        
      } catch (sendError) {
        console.error("Failed to send audio:", sendError.message);
        // Send error reaction
        await sendCustomReaction(client, message, "❌");
        
        return await client.sendMessage(message.from, {
          text: "*GALAXY-MD* " + toFancyFont("failed to send audio file"),
          viewOnce: true,
          mentions: [message.sender]
        }, { quoted: message });
      }
    }
  } catch (error) {
    console.error("❌ song error: " + error.message);
    // Send error reaction
    await sendCustomReaction(client, message, "❌");
    
    await client.sendMessage(message.from, {
      text: "*GALAXY-MD* " + toFancyFont("encountered an error. Please try again"),
      viewOnce: true,
      mentions: [message.sender]
    }, { quoted: message });
  }
};

export default play;
