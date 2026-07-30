import { SlashCommandBuilder } from 'discord.js';
import { useQueue, useTimeline } from 'discord-player';
import { noQueue } from '../bot-responses/errors.js';

export const command = new SlashCommandBuilder()
  .setName('pause') // Command name
  .setDescription('Pausa a música que está tocando atualmente'); // Command description

export async function execute(interaction) {
  // Get the queue's timeline
  const timeline = useTimeline();

  if (!timeline) {
    return interaction.reply(
      noQueue,
    );
  }

  // Invert the pause state
  const wasPaused = timeline.paused;

  wasPaused ? timeline.resume() : timeline.pause();

  // If the timeline was previously paused, the queue is now back to playing
  return interaction.reply(
    `O player está agora ${wasPaused ? 'tocando' : 'pausado'}.`,
  );
}