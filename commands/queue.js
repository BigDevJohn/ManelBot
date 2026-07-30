import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { noQueue } from '../bot-responses/errors.js';
 
export const command = new SlashCommandBuilder()
  .setName('queue') // Command name
  .setDescription('Exibe a fila de músicas'); // Command description
 
export async function execute(interaction) {
  // Get the current queue
  const queue = useQueue();
 
  if (!queue) {
    return interaction.reply(
      noQueue,
    );
  }
 
  // Get the current track
  const currentTrack = queue.currentTrack;
 
  // Get the upcoming tracks
  const upcomingTracks = queue.tracks.data.slice(0, 5);
 
  const message = [
  `**Tocando agora:** ${currentTrack?.title ?? 'Nenhuma música tocando'}`,
  '',
  '**Próximas Músicas:**',
  ...upcomingTracks
    .filter(Boolean)
    .map((track, index) => `${index + 1}. ${track.title ?? 'Título desconhecido'}`),
].join('\n');
 
  // Send the message
  return interaction.reply(message);
}