const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../models/UserProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('findpartner')
    .setDescription('Encontrar um parceiro de língua'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const myProfile = await UserProfile.findOne({ userId: interaction.user.id });

      if (!myProfile || !myProfile.learningLanguages || myProfile.learningLanguages.length === 0) {
        return interaction.editReply({ 
          content: '❌ Configura o teu perfil primeiro com `/configme`!' 
        });
      }

      const partners = await UserProfile.find({
        userId: { $ne: interaction.user.id },
        nativeLanguage: { $in: myProfile.learningLanguages },
        learningLanguages: myProfile.nativeLanguage
      }).limit(5);

      if (partners.length === 0) {
        return interaction.editReply({ 
          content: '🔍 Nenhum parceiro encontrado de momento. Tenta mais tarde!' 
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🤝 Parceiros Encontrados')
        .setDescription('Utilizadores anónimos compatíveis:')
        .setColor(0x00FF00);

      partners.forEach((partner, index) => {
        embed.addFields({
          name: `Parceiro #${index + 1}`,
          value: `Nativo: **${partner.nativeLanguage.toUpperCase()}** | A aprender: **${partner.learningLanguages.join(', ').toUpperCase()}**\nXP: **${partner.xp}** | Mensagens: **${partner.messagesSent}**`
        });
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({ content: '❌ Erro ao procurar parceiros.' });
    }
  }
};
