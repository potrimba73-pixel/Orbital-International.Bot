const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    // Handler de botões
    if (interaction.isButton()) {
      // Botão Aceitar Regras
      if (interaction.customId === 'aceitar_regras') {
        const member = interaction.member;
        const guild = interaction.guild;

        // Verificar se já tem cargo Member
        const memberRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'member');

        if (!memberRole) {
          return interaction.reply({
            content: '❌ Cargo **Member** não encontrado. Contacta um Staff.',
            ephemeral: true
          });
        }

        if (member.roles.cache.has(memberRole.id)) {
          return interaction.reply({
            content: '✅ Já aceitaste as regras anteriormente!',
            ephemeral: true
          });
        }

        try {
          await member.roles.add(memberRole);

          // Log no canal de logs (se existir)
          const logChannel = guild.channels.cache.find(
            c => c.name.toLowerCase().includes('logs') || c.name.toLowerCase().includes('audit')
          );

          if (logChannel) {
            logChannel.send(
              `✅ **${member.user.tag}** (ID: \`${member.id}\`) aceitou as regras e recebeu o cargo **Member**.`
            );
          }

          await interaction.reply({
            content: `🎉 Bem-vindo à estação espacial! Regras aceites. Cargo **Member** atribuído!`,
            ephemeral: true
          });
        } catch (err) {
          console.error('Erro ao atribuir cargo:', err);
          await interaction.reply({
            content: '❌ Erro ao atribuir cargo. Contacta um Staff.',
            ephemeral: true
          });
        }
        return;
      }
    }

    // Handler de comandos slash
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`Comando ${interaction.commandName} não encontrado.`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Erro no comando ${interaction.commandName}:`, error);

      const errorReply = {
        content: '❌ Ocorreu um erro ao executar este comando.',
        ephemeral: true
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorReply);
      } else {
        await interaction.reply(errorReply);
      }
    }
  }
};
