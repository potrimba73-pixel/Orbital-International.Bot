const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verificar')
    .setDescription('Verificar quem aceitou ou não as regras')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option =>
      option.setName('filtro')
        .setDescription('Filtrar por status')
        .setRequired(false)
        .addChoices(
          { name: 'Aceitaram', value: 'aceitaram' },
          { name: 'Não Aceitaram', value: 'nao_aceitaram' },
          { name: 'Todos', value: 'todos' }
        )),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const filtro = interaction.options.getString('filtro') || 'todos';

    const memberRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'member');

    if (!memberRole) {
      return interaction.editReply({
        content: '❌ Cargo **Member** não encontrado. Cria o cargo primeiro.'
      });
    }

    try {
      await guild.members.fetch();

      const membros = guild.members.cache.filter(m => !m.user.bot);
      const aceitaram = membros.filter(m => m.roles.cache.has(memberRole.id));
      const naoAceitaram = membros.filter(m => !m.roles.cache.has(memberRole.id));

      let lista = '';
      let titulo = '';
      let cor = 0x00FF00;

      if (filtro === 'aceitaram') {
        titulo = `✅ Membros que Aceitaram as Regras (${aceitaram.size})`;
        cor = 0x00FF00;
        lista = aceitaram.map(m => `• ${m.user.tag} (ID: \`${m.id}\`)`).join('\n') || 'Nenhum membro encontrado.';
      } else if (filtro === 'nao_aceitaram') {
        titulo = `❌ Membros que NÃO Aceitaram as Regras (${naoAceitaram.size})`;
        cor = 0xFF0000;
        lista = naoAceitaram.map(m => `• ${m.user.tag} (ID: \`${m.id}\`)`).join('\n') || 'Nenhum membro encontrado.';
      } else {
        titulo = `📊 Status de Verificação - ${guild.name}`;
        cor = 0x0099FF;
        lista = 
          `✅ **Aceitaram:** ${aceitaram.size} membros\n` +
          `❌ **Não Aceitaram:** ${naoAceitaram.size} membros\n` +
          `📈 **Taxa:** ${membros.size > 0 ? Math.round((aceitaram.size / membros.size) * 100) : 0}%\n\n` +
          `--- Não Aceitaram ---\n` +
          (naoAceitaram.map(m => `• ${m.user.tag}`).join('\n') || 'Todos aceitaram!');
      }

      // Dividir em chunks se for muito longo
      const chunks = lista.match(/[\s\S]{1,4000}/g) || [lista];

      const embed = new EmbedBuilder()
        .setTitle(titulo)
        .setDescription(chunks[0].slice(0, 4096))
        .setColor(cor)
        .setFooter({ text: `Total: ${membros.size} membros | Cargo: ${memberRole.name}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // Se houver mais chunks, enviar follow-ups
      for (let i = 1; i < chunks.length; i++) {
        await interaction.followUp({
          embeds: [new EmbedBuilder()
            .setDescription(chunks[i].slice(0, 4096))
            .setColor(cor)
          ],
          ephemeral: true
        });
      }

    } catch (err) {
      console.error('Erro ao verificar membros:', err);
      await interaction.editReply({
        content: '❌ Erro ao verificar membros. Tenta novamente.'
      });
    }
  }
};
