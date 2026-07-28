import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export const command = new SlashCommandBuilder()
    .setName('stop') // Command name
    .setDescription('Para a música que está tocando atualmente');

export async function execute(interaction) {

    const queue = useQueue(interaction.guild.id);
    queue.delete();

}