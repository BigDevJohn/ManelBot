// Import necessary classes from discord.js
import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { useMainPlayer } from 'discord-player';

 
// Define the play command
export const command = new SlashCommandBuilder()
  .setName('play') // Command name
  .setDescription('Tocar uma música em um canal de voz') // Command description
  .addStringOption(
    (option) =>
      option
        .setName('song') // Option name
        .setDescription('Musica para tocar') // Option description
        .setRequired(true), // Make the option required
  );
 
// Define the execute function for the play command
export async function execute(interaction) {
  // Get the player instance
  const player = useMainPlayer();
  // Get the song query from the user input
  const query = interaction.options.getString('song', true);
}
 
// Define the execute function for the play command
export async function execute(interaction) {
  // Get the player instance and song query
  const player = useMainPlayer();
  const query = interaction.options.getString('song', true);
 
  // Get the voice channel of the user and check permissions
  const voiceChannel = interaction.member.voice.channel;
 
  if (!voiceChannel) {
    return interaction.reply(
      'You need to be in a voice channel to play music!',
    );
  }
 
  if (
    interaction.guild.members.me.voice.channel &&
    interaction.guild.members.me.voice.channel !== voiceChannel
  ) {
    return interaction.reply(
      'I am already playing in a different voice channel!',
    );
  }
 
  if (
    !voiceChannel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionsBitField.Flags.Connect)
  ) {
    return interaction.reply(
      'I do not have permission to join your voice channel!',
    );
  }
 
  if (
    !voiceChannel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionsBitField.Flags.Speak)
  ) {
    return interaction.reply(
      'I do not have permission to speak in your voice channel!',
    );
  }
 
  try {
    // Play the song in the voice channel
    const result = await player.play(voiceChannel, query, {
      nodeOptions: {
        metadata: { channel: interaction.channel }, // Store text channel as metadata on the queue
      },
    });
 
    // Reply to the user that the song has been added to the queue
    return interaction.reply(
      `${result.track.title} has been added to the queue!`,
    );
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return interaction.reply('An error occurred while playing the song!');
  }
}