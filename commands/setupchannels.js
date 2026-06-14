const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField } = require('discord.js');

const VOICE_LIMITS = {
  'Portuguese-1': 10,
  'Portuguese-2': 20,
  'English-1': 10,
  'English-2': 20,
  'Russian-1': 10,
  'Spanish-1': 10,
  'French-1': 10
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupchannels')
    .setDescription('Criar canais automaticamente')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();

    const guild = interaction.guild;
    const created = [];
    const errors = [];

    const categories = {
      'Staff': null,
      'Português': null,
      'English': null,
      'Russian': null,
      'Spanish': null,
      'French': null
    };

    for (const [name, _] of Object.entries(categories)) {
      try {
        const category = await guild.channels.create({
          name: name,
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.id,
              allow: [PermissionsBitField.Flags.ViewChannel]
            }
          ]
        });
        categories[name] = category;
        created.push(`📁 Categoria: ${name}`);
      } catch (err) {
        errors.push(`❌ Categoria ${name}: ${err.message}`);
      }
    }

    for (const [name, limit] of Object.entries(VOICE_LIMITS)) {
      try {
        let categoryName = 'Português';
        if (name.startsWith('English')) categoryName = 'English';
        else if (name.startsWith('Russian')) categoryName = 'Russian';
        else if (name.startsWith('Spanish')) categoryName = 'Spanish';
        else if (name.startsWith('French')) categoryName = 'French';

        await guild.channels.create({
          name: name,
          type: ChannelType.GuildVoice,
          parent: categories[categoryName],
          userLimit: limit
        });
        created.push(`🔊 Voz: ${name} (limite: ${limit})`);
      } catch (err) {
        errors.push(`❌ Voz ${name}: ${err.message}`);
      }
    }

    const result = [
      `✅ **Criados (${created.length}):**\n${created.join('\n')}`,
      errors.length > 0 ? `\n❌ **Erros (${errors.length}):**\n${errors.join('\n')}` : ''
    ].join('');

    await interaction.editReply({ content: result.slice(0, 2000) });
  }
};
