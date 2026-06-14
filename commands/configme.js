const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../models/UserProfile');

const LANGUAGES = [
  { name: 'Português', value: 'pt' },
  { name: 'English', value: 'en' },
  { name: 'Russian', value: 'ru' },
  { name: 'Español', value: 'es' },
  { name: 'Français', value: 'fr' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configme')
    .setDescription('Configurar o teu perfil de língua')
    .addStringOption(option =>
      option.setName('nativa')
        .setDescription('A tua língua nativa')
        .setRequired(true)
        .addChoices(...LANGUAGES))
    .addStringOption(option =>
      option.setName('aprender')
        .setDescription('Línguas que queres aprender (separadas por vírgula)')
        .setRequired(true)),

  async execute(interaction) {
    const native = interaction.options.getString('nativa');
    const learningRaw = interaction.options.getString('aprender');
    const learning = learningRaw.split(',').map(l => l.trim().toLowerCase());

    try {
      let profile = await UserProfile.findOne({ userId: interaction.user.id });

      if (!profile) {
        profile = new UserProfile({
          userId: interaction.user.id,
          username: interaction.user.username
        });
      }

      profile.nativeLanguage = native;
      profile.learningLanguages = learning;
      profile.updatedAt = new Date();
      await profile.save();

      const embed = new EmbedBuilder()
        .setTitle('✅ Perfil Atualizado')
        .setDescription(`Língua nativa: **${native.toUpperCase()}**\nA aprender: **${learning.join(', ').toUpperCase()}**`)
        .setColor(0x00FF00);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: '❌ Erro ao guardar perfil. Tenta mais tarde.', ephemeral: true });
    }
  }
};
