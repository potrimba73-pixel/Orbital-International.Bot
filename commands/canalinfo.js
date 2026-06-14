const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('canalinfo')
    .setDescription('Informações de canal de voz')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal de voz')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');

    const embed = new EmbedBuilder()
      .setTitle(`🔊 ${channel.name}`)
      .addFields(
        { name: '🆔 ID', value: channel.id, inline: true },
        { name: '👥 Limite', value: channel.userLimit ? `${channel.userLimit} pessoas` : 'Sem limite', inline: true },
        { name: '👤 Membros atuais', value: channel.members.size.toString(), inline: true },
        { name: '🔇 Bitrate', value: `${channel.bitrate / 1000}kbps`, inline: true },
        { name: '📍 Categoria', value: channel.parent ? channel.parent.name : 'Nenhuma', inline: true }
      )
      .setColor(0x0099FF);

    await interaction.reply({ embeds: [embed] });
  }
};
