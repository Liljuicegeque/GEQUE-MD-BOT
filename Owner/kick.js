// 📂 File: kick.js
// ☠️ Kick Command - LiljuiceGeque-MD (Baileys-based)

// Export main command function
module.exports = async function kick({ conn, m, args, reply }) {
  try {
    // helper: determine chat id & sender id robustly
    const chat = m.chat || (m.key && m.key.remoteJid);
    const sender = m.sender || m.participant || (m.key && m.key.participant);

    if (!chat) return reply('❌ Chat ID not found.');

    // Ensure this is a group
    if (!chat.endsWith('@g.us')) {
      return reply('❌ This command only works in groups.');
    }

    // Determine target: prefer replied user, else first mentioned arg
    let target;
    if (m.quoted) {
      // quoted message participant (most common)
      target = m.quoted.sender || m.quoted.participant || (m.quoted.key && m.quoted.key.participant);
    }

    // if no reply, try first mention or phone in args
    if (!target) {
      // handle @mentions in args (like @1234567890)
      if (m.mentioned && m.mentioned.length) {
        target = m.mentioned[0];
      } else if (args && args.length) {
        // try to normalize numeric ID
        let possible = args[0].replace(/[^0-9@.+]/g, '');
        if (!possible.includes('@')) possible = possible + '@s.whatsapp.net';
        target = possible;
      }
    }

    if (!target) return reply('❌ Use: Reply to the user  you want to kick,then type .kick .');

    // Normalize target to JID form
    if (!target.includes('@')) target = `${target}@s.whatsapp.net`;

    // Fetch group metadata to check admins and bot admin status
    let metadata;
    try {
      metadata = await conn.groupMetadata(chat);
    } catch (err) {
      // fallback: reply error
      console.error('groupMetadata error:', err);
      return reply('⚠️ Group metadata not found — maybe network issue or insufficient permissions.');
    }

    const participants = metadata.participants || [];
    const adminIDs = participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin' || p.isAdmin) // compatibility
      .map(p => p.id || p.jid || p.participant);

    // Determine if sender is admin
    const isSenderAdmin = adminIDs.includes(sender);
    // Determine if bot is admin
    const botId = (conn.user && conn.user.id) || conn.user?.jid || conn.user?.me || conn.authState?.creds?.me?.id || conn.user;
    // normalize botId if needed
    const botJid = (typeof botId === 'string' && botId.includes('@')) ? botId : (conn.user && conn.user.jid) || botId;
    const isBotAdmin = adminIDs.includes(botJid);

    if (!isSenderAdmin) {
      return reply('❌ Only group admins can remove members. You arent an admin.');
    }

    if (!isBotAdmin) {
      return reply('❌ Bot needs admin rights to remove members. Make the bot admin first.');
    }

    // Prevent trying to remove group owner / superadmin maybe (best-effort)
    const owner = metadata.owner || metadata.creator || (participants.find(p => p.admin === 'superadmin') || {}).id;
    if (owner && (owner === target || owner === (target.replace(/@s\.whatsapp\.net$/, '') + '@s.whatsapp.net'))) {
      return reply('❌ Uhmmm Geque I cannot remove main group owner.');
    }

    // Prevent kicking self or the bot mistakenly
    if (target === sender) {
      return reply('❌ You cannot remove yourself.');
    }
    if (target === botJid) {
      return reply('❌ It is impossible to remove the bot itself.');
    }

    // Do the removal
    try {
      // Baileys API: conn.groupParticipantsUpdate(groupId, [participant], action)
      await conn.groupParticipantsUpdate(chat, [target], 'remove');

      // Notify success
      const targetNum = target.split('@')[0];
      reply(`✅ User  ${targetNum} You have been removed from the group.`);
    } catch (err) {
      console.error('kick error:', err);
      // Show more user-friendly error
      let msg = '⚠️ Error occurred while removing user.';
      if (err && err.message) msg += `\n\nError: ${err.message}`;
      reply(msg);
    }
  } catch (e) {
    console.error(e);
    reply(
`╭━━━〔 ⚠️ *ERROR* 〕━━━╮
┃ ${e.message || e}
╰━━━━━━━━━━━━━━━━━━━╯`
    );
  }
};

// Optional hook export (If your handler is putting this much load)
module.exports.help = {
  name: 'kick',
  usage: '.kick (reply to user)',
  description: 'It will remove the user who tagged or replied to from the group (admin only).'
};
