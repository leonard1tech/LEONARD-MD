    if (response) {
        await sock.sendMessage(chatId, {
            text: `💥 > *© 𝕃𝕖𝕠𝕟𝕒𝕣𝕕 𝕓𝕠𝕥 ℝ𝕖𝕡𝕣𝕚𝕖𝕕:*\n\n${response}\n\n💡 > *AI Powered by Leonard Tech*`
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, {
            text: '⚠️ I tried, but couldn’t understand that. Try rephrasing your message.',
            quoted: message
        });
    }
}

async function getAIResponse(userMessage, context) {
    try {
        const prompt = `User: ${userMessage}\n\nChat history:\n${context.messages.join('\n')}`;
        const res = await fetch("https://api.dreaded.site/api/chatgpt?text=" + encodeURIComponent(prompt));
        const json = await res.json();
        return json.result?.prompt || null;
    } catch (e) {
        return null;
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
};
