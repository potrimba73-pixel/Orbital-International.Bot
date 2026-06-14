const { Client, Collection, GatewayIntentBits, Partials, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

require('./keep_alive');
const { connectDB } = require('./utils/database');
connectDB();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = new Collection();
client.cooldowns = new Collection();

// Carregar Comandos
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando carregado: ${command.data.name}`);
      } else {
        console.warn(`⚠️ Comando ${file} sem "data" ou "execute"`);
      }
    } catch (err) {
      console.error(`❌ Erro ao carregar comando ${file}:`, err.message);
    }
  }
}

// Carregar Eventos
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      console.log(`✅ Evento carregado: ${event.name}`);
    } catch (err) {
      console.error(`❌ Erro ao carregar evento ${file}:`, err.message);
    }
  }
}

// Handler de botões global (backup)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'aceitar_regras') {
    const member = interaction.member;
    const guild = interaction.guild;

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
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

client.login(process.env.DISCORD_TOKEN);
