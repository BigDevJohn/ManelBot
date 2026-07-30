// Import necessary classes from discord.js
import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { notInVoiceChannel, alreadyInVoiceChannel, noPermission, noChannelPermission } from '../bot-responses/errors.js';

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
  // Get the player instance and song query
  const player = useMainPlayer();
  const query = interaction.options.getString('song', true);

  // Get the voice channel of the user and check permissions
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply(
      notInVoiceChannel,
    );
  }

  if (
    interaction.guild.members.me.voice.channel &&
    interaction.guild.members.me.voice.channel !== voiceChannel
  ) {
    return interaction.reply(
      alreadyInVoiceChannel,
    );
  }

  if (
    !voiceChannel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionsBitField.Flags.Connect)
  ) {
    return interaction.reply(
      noPermission,
    );
  }

  if (
    !voiceChannel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionsBitField.Flags.Speak)
  ) {
    return interaction.reply(
      noChannelPermission,
    );
  }

  // player.play pode demorar (busca/stream), então adia a resposta
  await interaction.deferReply();

  try {
    // Play the song in the voice channel
    const result = await player.play(voiceChannel, query, {
      nodeOptions: {
        metadata:  interaction.channel, // Store text channel as metadata on the queue
      },
    });

    // Reply to the user that the song has been added to the queue
    return interaction.editReply(
      `${result.track.title} foi adicionada à fila!`,
    );
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    return interaction.editReply(errorPlayingSong);
  }
}