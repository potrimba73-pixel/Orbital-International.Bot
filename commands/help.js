const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Menu de ajuda do bot'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🌍 Orbital International - Ajuda')
      .setDescription('Bot anónimo para aprendizagem de línguas')
      .setColor(0x0099FF)
      .addFields(
        { name: '🎓 Comandos Gerais', value: '`/configme` - Configurar perfil\n`/translate` - Traduzir texto\n`/findpartner` - Encontrar parceiro de língua\n`/mystats` - As tuas estatísticas\n`/leaderboard` - Top aprendizes\n`/ping` - Latência do bot' },
        { name: '🛡️ Comandos Staff', value: '`/serverinfo` - Info do servidor\n`/userinfo` - Info de utilizador\n`/canalinfo` - Info de canal de voz\n`/setupchannels` - Criar canais automaticamente\n`/regras` - Painel de regras\n`/verificar` - Verificar quem aceitou regras\n`/limpar` - Limpar mensagens\n`/anuncio` - Anúncio' }
      )
      .setFooter({ text: 'Orbital International' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
