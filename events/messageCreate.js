const UserProfile = require('../models/UserProfile');

const xpCooldown = new Map();
const COOLDOWN_MS = 60000;

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const userId = message.author.id;
    const now = Date.now();

    if (xpCooldown.has(userId)) {
      const lastXP = xpCooldown.get(userId);
      if (now - lastXP < COOLDOWN_MS) return;
    }

    try {
      let profile = await UserProfile.findOne({ userId });

      if (!profile) {
        profile = new UserProfile({
          userId,
          username: message.author.username
        });
      }

      const xpGained = Math.floor(Math.random() * 11) + 5;
      profile.xp += xpGained;
      profile.messagesSent += 1;
      profile.updatedAt = new Date();

      await profile.save();
      xpCooldown.set(userId, now);

    } catch (err) {
      // Silencioso
    }
  }
};
