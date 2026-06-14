const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Informações do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👥 Membros', value: guild.memberCount.toString(), inline: true },
        { name: '📅 Criado em', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👑 Dono', value: `<@${guild.ownerId}>`, inline: true },
        { name: '💬 Canais Texto', value: guild.channels.cache.filter(c => c.type === 0).size.toString(), inline: true },
        { name: '🔊 Canais Voz', value: guild.channels.cache.filter(c => c.type === 2).size.toString(), inline: true },
        { name: '🏷️ Cargos', value: guild.roles.cache.size.toString(), inline: true }
      )
      .setColor(0x0099FF)
      .setFooter({ text: `ID: ${guild.id}` });

    await interaction.reply({ embeds: [embed] });
  }
};
