const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Top aprendizes (anónimo)'),

  async execute(interaction) {
    try {
      const topUsers = await UserProfile.find()
        .sort({ xp: -1 })
        .limit(10);

      if (topUsers.length === 0) {
        return interaction.reply({ 
          content: '📭 Leaderboard vazio. Começa a conversar para ganhar XP!', 
          ephemeral: true 
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🏆 Top Aprendizes')
        .setDescription('Classificação anónima por XP')
        .setColor(0xFFD700);

      topUsers.forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔹';
        embed.addFields({
          name: `${medal} #${index + 1}`,
          value: `XP: **${user.xp}** | Mensagens: **${user.messagesSent}** | Nativo: **${user.nativeLanguage.toUpperCase()}**`
        });
      });

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ Erro ao carregar leaderboard.', ephemeral: true });
    }
  }
};
