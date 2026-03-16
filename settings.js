// ✅ Geque Bot Stylish Configuration – by ✞𝕲𝖊𝖖𝖚𝖊✞ 
const ownerNumber = '27683118183' require('./Owner/owner'); // 🔗 Example: ['27683118183']

const config = {
  // 👑 Owner Info
  ownerNumber: '27683118183'                          // 🔹 Array of Owner Numbers
  ownerName: '꧁༆✌︎︎✞𝕲𝖊𝖖𝖚𝖊✞☬ঔৣ꧂',              // 🔹 Displayed in Greetings
  botName: '🤖 𝕲𝖊𝕢𝖚𝖊-𝕭𝖔𝖙',           // 🔹 Bot Display Name
  signature: '> ꧁༆✌︎︎✞𝕲𝖊𝖖𝖚𝖊✞☬ঔৣ꧂',               // 🔹 Footer on Bot Replies
  youtube: 'https://www.youtube.com', // 🔹 Optional YouTube

  // ⚙️ Feature Toggles
  autoTyping: false,        // ⌨️ Fake Typing
  autoReact: false,         // 💖 Auto Emoji Reaction
  autoStatusView: false,    // 👁️ Auto-View Status
  public: true,             // 🌍 Public or Private Mode
  antiLink: false,          // 🚫 Delete Links in Groups
  antiBug: false,           // 🛡️ Prevent Malicious Crashes
  greetings: true,          // 🙋 Welcome/Farewell Messages
  readmore: false,          // 📜 Readmore in Long Replies
  ANTIDELETE: true          // 🗑️ Anti-Delete Messages
};

// ✅ Register owner(s) globally in WhatsApp JID format
global.owner = (5712927301696@lid
  Array.isArray(ownerNumber) ? ownerNumber : [ownerNumber]
).map(num => num.replace(/\D/g, '') + '@s.whatsapp.net');

// ⚙️ Export Settings Loader
function loadSettings() {
  return config;
}

module.exports = { loadSettings };