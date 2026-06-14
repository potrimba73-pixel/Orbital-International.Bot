const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

const LANGUAGES = [
  { name: 'Português', value: 'pt' },
  { name: 'English', value: 'en' },
  { name: 'Russian', value: 'ru' },
  { name: 'Español', value: 'es' },
  { name: 'Français', value: 'fr' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Traduzir texto')
    .addStringOption(option =>
      option.setName('texto')
        .setDescription('Texto a traduzir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('para')
        .setDescription('Língua de destino')
        .setRequired(true)
        .addChoices(...LANGUAGES))
    .addStringOption(option =>
      option.setName('de')
        .setDescription('Língua de origem (auto-detectado se omitido)')
        .setRequired(false)
        .addChoices(...LANGUAGES)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const text = interaction.options.getString('texto');
    const to = interaction.options.getString('para');
    const from = interaction.options.getString('de') || 'auto';

    try {
      const result = await translate(text, { from, to });

      const embed = new EmbedBuilder()
        .setTitle('🌐 Tradução')
        .addFields(
          { name: `📤 Original (${result.from.language.iso})`, value: text },
          { name: `📥 Tradução (${to})`, value: result.text }
        )
        .setColor(0x0099FF);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({ content: '❌ Erro na tradução. Verifica o texto e as línguas.' });
    }
  }
};
