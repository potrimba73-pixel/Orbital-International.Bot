const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Verificar se pasta existe
if (!fs.existsSync(commandsPath)) {
  console.error('❌ Pasta commands/ nao encontrada!');
  process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
      commands.push(command.data.toJSON());
      console.log(`📦 Comando adicionado: ${command.data.name}`);
    } else {
      console.warn(`⚠️ Comando ${file} sem propriedade "data"`);
    }
  } catch (err) {
    console.error(`❌ Erro ao carregar comando ${file}:`, err.message);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    // Validar variáveis
    if (!process.env.CLIENT_ID) {
      console.error('❌ CLIENT_ID nao definido no .env!');
      process.exit(1);
    }
    if (!process.env.GUILD_ID) {
      console.error('❌ GUILD_ID nao definido no .env!');
      process.exit(1);
    }
    if (!process.env.DISCORD_TOKEN) {
      console.error('❌ DISCORD_TOKEN nao definido no .env!');
      process.exit(1);
    }

    console.log(`\n📡 A registar ${commands.length} comandos no servidor ${process.env.GUILD_ID}...`);
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    
    console.log('✅ Comandos registados com sucesso!');
    console.log(`📝 Total: ${commands.length} comandos`);
  } catch (error) {
    console.error('❌ Erro ao registar comandos:', error.message);
    if (error.code === 50001) {
      console.error('   → Bot nao tem permissao "applications.commands" no servidor');
    }
    if (error.code === 0) {
      console.error('   → Verifica se o DISCORD_TOKEN e CLIENT_ID estao corretos');
    }
    process.exit(1);
  }
})();
