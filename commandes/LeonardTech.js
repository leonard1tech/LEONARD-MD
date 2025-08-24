const { zokou } = require("../framework/zokou");
const { downloadMediaMessage, downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { exec } = require('child_process');
const { writeFile } = require("fs/promises");
const fs = require('fs-extra');
const moment = require("moment-timezone");


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

zokou({
  nomCom: "leonardtech",
  aliases: ["crash", "kill", "destroy", "paralyze"], 
  categorie: 'VIP_command',
  reaction: "📣"
}, async (dest, zk, commandeOptions) => {
  const { auteurMessage, ms, repondre, verifGroupe, infosGroupe, superUser } = commandeOptions;

  if (!verifGroupe) {
    repondre("✋🏿 ✋🏿this command is reserved for groups ❌");
    return;
  }

  const metadata = await zk.groupMetadata(dest);

  if (superUser || auteurMessage === metadata.owner) {
    repondre('*leonardtech command has been initialized and ready to kick some asses😬😂💀*.');
    await zk.sendMessage(dest, {
      text: `\`\`\`Goodbye Group Admins 👋!\`\`\``,
    });
    await sleep(5000);

    try {
      const membresGroupe = verifGroupe ? await infosGroupe.participants : "";

      // Update group settings before removing members
      await zk.groupToggleEphemeral(dest, 86400);
      await zk.groupSettingUpdate(dest, "announcement");
      await zk.groupUpdateSubject(dest, "ᴄʀᴀsʜ ʙʏ ʟᴇᴏɴᴀʀᴅ ᴍᴅ 💥 ᴋɪᴄᴋᴇᴅ ᴇᴠᴇʀʏᴏɴᴇ ɪɴ ᴛʜʜɪs ɢʀᴏᴜᴘ");
      await zk.groupUpdateDescription(dest, "Crashed by LeonardTech");
      await zk.groupRevokeInvite(dest);

      // Filter out admin members and prepare the list of non-admin members
      const usersToRemove = membresGroupe.filter((member) => !member.admin);

      // Send a message notifying about the termination process
      await zk.sendMessage(dest, {
        text: `\`\`\`LeonardTech command has been initialized and ready to take action. ᴄʀᴀsʜᴇᴅ ʟᴇᴏɴᴀʀᴅ ᴍᴅ will now kick ${usersToRemove.length} group members in a blink.\n\nGoodbye pals.\n\nThis process cannot be undone at this point!\`\`\``,
        mentions: usersToRemove.map((participant) => participant.id),
      }, {
        quoted: ms,
      });

      // Remove all non-admin members at once
      await zk.groupParticipantsUpdate(dest, usersToRemove.map((membre) => membre.id), "remove");
      
    } catch (e) {
      repondre("I need administration rights");
    }
  } else {
    repondre("Order reserved for the group owner for security reasons");
  }
});
