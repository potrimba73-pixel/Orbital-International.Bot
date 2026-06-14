const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Informações de um utilizador')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('utilizador')
        .setDescription('Utilizador a consultar')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('utilizador');
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📅 Conta criada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '📥 Entrou no servidor', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'N/A', inline: true }
      )
      .setColor(0x0099FF);

    await interaction.reply({ embeds: [embed] });
  }
};
