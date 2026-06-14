const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Latência do bot'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 A calcular...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Latência Bot', value: `${latency}ms`, inline: true },
        { name: 'Latência API', value: `${apiLatency}ms`, inline: true }
      )
      .setColor(latency < 100 ? 0x00FF00 : latency < 300 ? 0xFFFF00 : 0xFF0000);

    await interaction.editReply({ content: '', embeds: [embed] });
  }
};
