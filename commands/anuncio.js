const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Enviar anúncio')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal para o anúncio')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .addStringOption(option =>
      option.setName('titulo')
        .setDescription('Título do anúncio')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('mensagem')
        .setDescription('Conteúdo do anúncio')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('cor')
        .setDescription('Cor do embed (hex, ex: #FF0000)')
        .setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const title = interaction.options.getString('titulo');
    const message = interaction.options.getString('mensagem');
    const colorHex = interaction.options.getString('cor') || '#0099FF';

    try {
      const color = parseInt(colorHex.replace('#', ''), 16) || 0x0099FF;

      const embed = new EmbedBuilder()
        .setTitle(`📢 ${title}`)
        .setDescription(message)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: `Por ${interaction.user.username}` });

      await channel.send({ embeds: [embed] });
      await interaction.reply({ 
        content: `✅ Anúncio enviado para ${channel}!`, 
        ephemeral: true 
      });
    } catch (err) {
      await interaction.reply({ 
        content: '❌ Erro ao enviar anúncio.', 
        ephemeral: true 
      });
    }
  }
};
