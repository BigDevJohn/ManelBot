import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { noCurrentTrack } from '../bot-responses/errors.js';

export const command = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Para a música que está tocando atualmente');

export async function execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.currentTrack) {
        return interaction.reply({
            content: noCurrentTrack,
            ephemeral: true,
        });
    }

    const memberVoiceChannel = interaction.member.voice.channel;
    if (!memberVoiceChannel || memberVoiceChannel.id !== queue.channel.id) {
        return interaction.reply({
            content: needToBeInSameVoiceChannel,
            ephemeral: true,
        });
    }

    try {
        queue.delete();
        await interaction.reply(stopResponse);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: stoppingTrackError,
            ephemeral: true,
        });
    }
}