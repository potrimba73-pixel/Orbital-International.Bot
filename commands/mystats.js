const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mystats')
    .setDescription('As tuas estatísticas anónimas'),

  async execute(interaction) {
    try {
      const profile = await UserProfile.findOne({ userId: interaction.user.id });

      if (!profile) {
        return interaction.reply({ 
          content: '❌ Perfil não encontrado. Usa `/configme` primeiro!', 
          ephemeral: true 
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('📊 As Tuas Estatísticas')
        .setDescription('Dados anónimos da tua atividade')
        .setColor(0x0099FF)
        .addFields(
          { name: '🗣️ Língua Nativa', value: profile.nativeLanguage.toUpperCase(), inline: true },
          { name: '📚 A Aprender', value: profile.learningLanguages.map(l => l.toUpperCase()).join(', '), inline: true },
          { name: '⭐ XP Total', value: profile.xp.toString(), inline: true },
          { name: '💬 Mensagens', value: profile.messagesSent.toString(), inline: true },
          { name: '📅 Membro desde', value: `<t:${Math.floor(profile.createdAt.getTime() / 1000)}:D>`, inline: true }
        )
        .setFooter({ text: 'ID anónimo: ' + profile.userId.slice(-4) });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: '❌ Erro ao carregar estatísticas.', ephemeral: true });
    }
  }
};
