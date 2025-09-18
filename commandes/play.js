const {
  zokou
} = require("../framework/zokou");
const axios = require("axios");
const ytSearch = require("yt-search");
zokou({
  'nomCom': "play",
  'aliases': ["song", 'playdoc', 'audio', "mp3"],
  'categorie': 'Search',
  'reaction': '🎧'
}, async (_0x119072, _0x2c9183, _0x4cdfbc) => {
  const {
    arg: _0x19a3f7,
    ms: _0x49bd3b,
    repondre: _0x145040
  } = _0x4cdfbc;
  if (!_0x19a3f7[0x0]) {
    return _0x145040("Please provide a video name.");
  }
  const _0x4ba3ad = _0x19a3f7.join(" ");
  try {
    const _0x5dce15 = await ytSearch(_0x4ba3ad);
    if (!_0x5dce15 || !_0x5dce15.videos.length) {
      return _0x145040("No video found for the specified query.");
    }
    const _0x1359fb = _0x5dce15.videos[0x0];
    const _0x291712 = _0x1359fb.url;
    const _0x163383 = async _0x485b58 => {
      try {
        const _0x50a433 = await axios.get(_0x485b58);
        return _0x50a433.data;
      } catch (_0x130f48) {
        console.error("Error fetching data from API:", _0x130f48);
        return {
          'success': false
        };
      }
    };
    const _0x409134 = ['https://apis.davidcyriltech.my.id/download/ytmp4?url=' + encodeURIComponent(_0x291712), 'https://apis.davidcyriltech.my.id/youtube/mp3?url=' + encodeURIComponent(_0x291712), "https://www.dark-yasiya-api.site/download/ytmp3?url=" + encodeURIComponent(_0x291712), "https://api.giftedtech.web.id/api/download/dlmp3?url=" + encodeURIComponent(_0x291712) + "&apikey=gifted-md", "https://api.dreaded.site/api/ytdl/audio?url=" + encodeURIComponent(_0x291712)];
    let _0x239c32;
    for (const _0x2b2406 of _0x409134) {
      _0x239c32 = await _0x163383(_0x2b2406);
      if (_0x239c32 && _0x239c32.success) {
        break;
      }
    }
    if (!_0x239c32 || !_0x239c32.success) {
      return _0x145040("Failed to retrieve download URL from all sources. Please try again later.");
    }
    const _0x2d1a51 = _0x239c32.result.download_url;
    const _0xbf16ad = _0x239c32.result;
    const _0x1f96c1 = [{
      'caption': "\n*☢️ LEONARD-MD DOWNLOADER ☢️*\n\n *Title: " + _0xbf16ad.title + "*\n *Quality: High*\n *Duration: " + _0x1359fb.timestamp + "*\n> *> ® Leonard-Md Player* \n",
      'document': {
        'url': _0x2d1a51
      },
      'mimetype': "audio/mpeg",
      'contextInfo': {
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363419863942379@newsletter",
          'newsletterName': "LEONARD-MD",
          'serverMessageId': 0x8f
        },
        'forwardingScore': 0x3e7,
        'externalAdReply': {
          'title': "®Leonard Tech",
          'body': "YouTube Search",
          'thumbnailUrl': 'https://files.catbox.moe/xv5h54.jpg',
          'sourceUrl': 'https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K',
          'mediaType': 0x1,
          'renderLargerThumbnail': true
        }
      }
    }, {
      'audio': {
        'url': _0x2d1a51
      },
      'mimetype': "audio/mp4",
      'contextInfo': {
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363419863942379@newsletter",
          'newsletterName': "Leonard-Md",
          'serverMessageId': 0x8f
        },
        'forwardingScore': 0x3e7,
        'externalAdReply': {
          'title': '®Leonard-Md',
          'body': "YouTube Search",
          'thumbnailUrl': 'https://files.catbox.moe/xv5h54.jpg',
          'sourceUrl': "https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K",
          'mediaType': 0x1,
          'renderLargerThumbnail': true
        }
      }
    }];
    for (const _0x4f6d43 of _0x1f96c1) {
      await _0x2c9183.sendMessage(_0x119072, _0x4f6d43, {
        'quoted': _0x49bd3b
      });
    }
  } catch (_0x1d72cd) {
    console.error("Error during download process:", _0x1d72cd);
    return _0x145040("Download failed due to an error: " + (_0x1d72cd.message || _0x1d72cd));
  }
});