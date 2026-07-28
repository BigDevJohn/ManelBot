import {SlashCommandBuilder} from "discord.js";
import {useQueue} from "discord-player";

export const command = new SlashCommandBuilder()
    .setName("remove") // Command name
    .setDescription("Remove a música da fila") // Command description
    .addIntegerOption((option) =>
        option
            .setName("position")
            .setDescription("A posição da música na fila (começando de 0)")
            .setRequired(true),
    );

export async function execute(interaction) {
    const position = interaction.options.getInteger("position");
    const queue = useQueue(interaction.guild.id);
}