const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "script", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }


    

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg =  `
   *ʟᴇᴏɴᴀʀᴅ ᴍᴅ ɪᴍᴘᴏʀᴛᴀɴᴛ ɪɴғᴏ* 
❒───────────────────❒
*ɢɪᴛʜᴜʙ ʟɪɴᴋ*
> https://github.com/Zedkazzozoranda091/LEONARD-MD

*ᴡʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ*
> https://whatsapp.com/channel/0029VakLfckBlHpYVxryFJ14

*ғᴏʀ ᴍᴏʀᴇ ɪɴғᴏ ᴛᴀᴘ ᴏɴ ᴛʜᴇ ʟɪɴᴋ ʙᴇʟᴏᴡ*
> https://github.com/Zedkazzozoranda091
╭───────────────────❒
│❒⁠⁠⁠⁠ *RAM* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
│❒⁠⁠⁠⁠ *DEV* : *𝐋𝐄𝐎𝐍𝐀𝐑𝐃 𝐓𝐄𝐂𝐇*
⁠⁠⁠⁠╰───────────────────❒
  `;
    
let menuMsg = `
     𝐋𝐄𝐎𝐍𝐀𝐑𝐃 𝐓𝐄𝐀𝐌

❒────────────────────❒`;

   var lien = mybotpic();

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *leonardmd*, déveloper Leonard Tech" , gifPlayback : true }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Leonardmd*, déveloper Leonard Tech" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {
    
    repondre(infoMsg + menuMsg);
    
}

}); 
                              
