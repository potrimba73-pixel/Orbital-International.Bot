const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
  console.error('❌ Pasta de comandos não encontrada!');
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
      commands.push(command.data.toJSON());
      console.log(`📦 Comando adicionado: ${command.data.name}`);
    }
  } catch (err) {
    console.error(`❌ Erro ao carregar comando ${file}:`, err.message);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (!process.env.CLIENT_ID || !process.env.GUILD_ID) {
      console.error('❌ CLIENT_ID e GUILD_ID devem estar definidos no .env');
      process.exit(1);
    }

    console.log(`📝 A registar ${commands.length} comandos...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Comandos registados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registar comandos:', error);
  }
})();
