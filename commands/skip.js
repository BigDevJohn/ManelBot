import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { noQueue, noCurrentTrack } from '../bot-responses/errors.js';
import { skipResponse } from '../bot-responses/actions.js';

export const command = new SlashCommandBuilder()
  .setName('skip') // Command name
  .setDescription('Pula para a próxima música'); // Command description

export async function execute(interaction) {
  // Get the current queue
  const queue = useQueue();

  if (!queue) {
    return interaction.reply(
      noQueue,
    );
  }

  if (!queue.isPlaying()) {
    return interaction.reply(noCurrentTrack);
  }

  // Skip the current track
  queue.node.skip();

  // Send a confirmation message
  return interaction.reply(skipResponse);
}