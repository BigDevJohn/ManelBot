import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
 
export const command = new SlashCommandBuilder()
  .setName('nowplaying') // Command name
  .setDescription('Display the currently playing song'); // Command description
 
export async function execute(interaction) {
  // Get the current queue
  const queue = useQueue();
 
  if (!queue) {
    return interaction.reply(
      'This server does not have an active player session.',
    );
  }
 
  // Get the currently playing song
  const currentSong = queue.currentTrack;
 
  // Check if there is a song playing
  if (!currentSong) {
    return interaction.reply('No song is currently playing.');
  }
 
  // Send the currently playing song information
  return interaction.reply(`Now playing: ${currentSong.name}`);
}