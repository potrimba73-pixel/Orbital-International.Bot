const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regras')
    .setDescription('Painel de regras da comunidade')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(':Rules: **ORBITAL-INTERNATIONAL • COMMUNITY RULES** :satellite_orbital:')
      .setDescription(
        '> Welcome to the space station. To maintain a **safe**, **private**, and **productive** environment for learning and connection, all members must follow these guidelines.\n\n' +
        '**:link: Official Discord Guidelines:**\n' +
        'As an official community, we comply with Discord\'s policies. All members are required to follow their guidelines:\n' +
        '• [Discord Terms of Service](https://discord.com/terms)\n' +
        '• [Discord Community Guidelines](https://discord.com/guidelines)\n\n' +
        ':ringed_planet: ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ :ringed_planet:\n\n' +
        ':pushpin: __**1. EQUALITY & RESPECT**__ (All Are Equal)\n' +
        'There is no hierarchy here. **Every member is equal**. Treat everyone with respect, regardless of their nationality, background, or skill level.\n\n' +
        ':pushpin: __**2. LEARNING MATURITY & PATIENCE**__\n' +
        'This is a language learning space. **Laughing at or mocking** someone who is starting to speak or learn a new language is **strictly prohibited**. Have the maturity to support and help others grow.\n\n' +
        ':pushpin: __**3. POLITICAL DISCUSSIONS & EXPRESSION**__\n' +
        'We believe in freedom of expression. Political topics and complex discussions are allowed, but they are **strictly limited**. Do not abuse this freedom. If a discussion becomes heated, toxic, or divisive, staff will **shut it down immediately**.\n\n' +
        ':pushpin: __**4. PRIVACY & ANONYMITY**__ (**CRITICAL**)\n' +
        'For your safety, **never share sensitive personal data** in public chats. This includes:\n' +
        '> :x: *Real addresses or locations.*\n' +
        '> :x: *Personal real-life photos or faces.*\n' +
        '> :x: *Full real names or private contact information.*\n\n' +
        ':pushpin: __**5. CORRECT CHANNELS & LANGUAGES**__\n' +
        'Use the appropriate text and voice sectors for their intended purpose. Always speak the **designated language** within its specific channel (e.g., only speak Portuguese inside the `#português` channel).\n\n' +
        '━━━━━━━━▼━━━━━━━━\n\n' +
        ':warning: **CONSEQUENCES & PUNISHMENTS**\n' +
        'Failure to follow these rules will result in **immediate disciplinary action** by the Staff. Depending on the severity, punishments include:\n\n' +
        '• :mute: **Mute / Timeout** ➔ *Temporary restriction from typing or speaking.*\n' +
        '• :no_pedestrians: **Server Kick or Permanent Ban** ➔ *For extreme toxicity, bullying, or spam.*\n\n' +
        '***\n' +
        '*By clicking the button below, you confirm that you have read, understood, and agreed to these terms.*'
      )
      .setColor(0x5865F2)
      .setImage('https://cdn.discordapp.com/attachments/placeholder/orbital-banner.png')
      .setFooter({ text: 'Orbital International • Space Station Rules v3.0' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('aceitar_regras')
          .setLabel('✅ I Accept the Rules')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🚀')
      );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
