const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limpar')
    .setDescription('Limpar mensagens')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName('quantidade')
        .setDescription('Número de mensagens a apagar (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)),

  async execute(interaction) {
    const amount = interaction.options.getInteger('quantidade');

    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ 
        content: `🗑️ Apagadas **${messages.size}** mensagens.`, 
        ephemeral: true 
      });
    } catch (err) {
      await interaction.reply({ 
        content: '❌ Erro ao apagar mensagens. Verifica permissões.', 
        ephemeral: true 
      });
    }
  }
};
