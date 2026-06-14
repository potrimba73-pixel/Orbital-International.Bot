const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Bot ligado como ${client.user.tag}`);
    console.log(`📊 A servir ${client.guilds.cache.size} servidor(es)`);
    console.log(`👥 ${client.users.cache.size} utilizadores em cache`);

    client.user.setActivity('/help | Anonymous Language Learning', { type: 3 });
  }
};
