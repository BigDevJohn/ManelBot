import {SlashCommandBuilder} from "discord.js";
import {useQueue} from "discord-player";
import {noQueue} from "../bot-responses/errors.js";

export const command = new SlashCommandBuilder()
    .setName("jump") // Command name
    .setDescription("Pula para uma música específica na fila") // Command description
    .addIntegerOption((option) =>
        option
            .setName("position")
            .setDescription("A posição da música na fila (começando de 1)")
            .setRequired(true),
    );

export async function execute(interaction) {
    const position = interaction.options.getInteger("position");
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
    return interaction.reply(
      noQueue,
    );
  }
    if (position < 1 || position > queue.size) {
        return interaction.reply('Posição inválida.');
    }

    queue.node.jump(position-1);
    return interaction.reply('Pulado para a música na posição ' + position);
}