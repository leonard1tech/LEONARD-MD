const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
require('dotenv').config({ path: './config.env' });

const SESSION_FILE = process.env.SESSION_FILE || 'auth_info';
const EMOJI_REACT = process.env.STATUS_LIKE_EMOJI || '♥️';
const PREFIX = process.env.PREFIX || '.';

console.clear();
console.log(chalk.green(figlet.textSync(process.env.BOT_NAME || 'LEONARD-MD')));
console.log(chalk.yellow(`🤖 Powered by ${process.env.OWNER_NAME || 'LEONARD TECH'}`));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FILE);
    const { version } = await fetchLatestBaileysVersion();

    if (process.env.SESSION_ID) {
        try {
            const creds = JSON.parse(Buffer.from(process.env.SESSION_ID, 'base64').toString());
            fs.writeFileSync(`${SESSION_FILE}/creds.json`, JSON.stringify(creds, null, 2));
            console.log(chalk.cyan('✅ SESSION_ID loaded from ENV.'));
        } catch (err) {
            console.log(chalk.red('❌ Invalid SESSION_ID in ENV. Using QR login...'));
        }
    }

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: !process.env.SESSION_ID,
        markOnlineOnConnect: true,
        logger: require('pino')({ level: 'info' }),
        browser: ['LEONARD-MD', 'Safari', '1.0.0'],
    });

    const autoRead = process.env.AUTO_READ?.toLowerCase() === 'yes';
    const antiDelete = process.env.ANTI_DELETE_MESSAGE?.toLowerCase() === 'yes';
    const autoViewStatus = process.env.AUTO_REACT_STATUS?.toLowerCase() === 'yes';
    const autoReact = process.env.AUTO_REACT?.toLowerCase() === 'yes';
    const pmPermit = process.env.PM_PERMIT?.toLowerCase() === 'yes';
    const publicMode = process.env.PUBLIC_MODE?.toLowerCase() === 'yes';
    const chatBot = process.env.CHAT_BOT?.toLowerCase() === 'yes';
    const audioChatBot = process.env.AUDIO_CHAT_BOT?.toLowerCase() === 'yes';
    const startingMsg = process.env.STARTING_BOT_MESSAGE?.toLowerCase() === 'yes';
    const presence = process.env.PRESENCE || '1';
    const warnCount = parseInt(process.env.WARN_COUNT) || 3;

    const menuLinks = (process.env.BOT_MENU_LINKS || '').split(',');

    if (autoRead) sock.ev.on('messages.upsert', async ({ messages }) => {
        for (let msg of messages) if (!msg.key.fromMe) await sock.readMessages([msg.key]);
    });

    if (antiDelete) sock.ev.on('message-revoke-everyone', async (item) => {
        if (item.message) console.log(chalk.red('⚠️ Message deleted:'), item.message);
    });

    if (autoViewStatus) sock.ev.on('new-status', async ({ id }) => {
        try {
            await sock.chatRead(id, 1);
            console.log(chalk.cyan(`👀 Viewed status from ${id}`));
        } catch (err) { console.error('Error viewing status:', err); }
    });

    if (autoReact) sock.ev.on('messages.upsert', async ({ messages }) => {
        for (let msg of messages) {
            if (!msg.key.fromMe && msg.message) {
                try { await sock.sendMessage(msg.key.remoteJid, { react: { text: EMOJI_REACT, key: msg.key } }); }
                catch (err) { console.log('Reaction error:', err.message); }
            }
        }
    });

    // Command Handler with PREFIX
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (let msg of messages) {
            if (!msg.key.fromMe && msg.message?.conversation) {
                const text = msg.message.conversation;
                if (text.startsWith(PREFIX)) {
                    const command = text.slice(PREFIX.length).trim().split(' ')[0].toLowerCase();
                    if (command === 'menu') {
                        await sock.sendMessage(msg.key.remoteJid, {
                            text: '🤖 Bot Menu Links:\n' + menuLinks.map((l,i) => `${i+1}. ${l}`).join('\n')
                        });
                    }
                    // Add more commands here
                }
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason === DisconnectReason.loggedOut) console.log(chalk.red('❌ Session logged out. Scan again.'));
            else { console.log(chalk.red('🔁 Reconnecting...')); startBot(); }
        } else if (connection === 'open') console.log(chalk.green('✅ Bot is connected and running!'));
    });

    sock.ev.on('creds.update', saveCreds);

    if (startingMsg) console.log(chalk.blue('🤖 Bot started successfully!'));

    switch(presence) {
        case '1': sock.presenceSubscribe(); break;
        case '2': console.log('💬 Bot is typing...'); break;
        case '3': console.log('🎤 Bot is recording...'); break;
        default: break;
    }
}

startBot();
