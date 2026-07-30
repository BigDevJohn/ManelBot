import { SlashCommandBuilder } from 'discord.js';
import { QueueRepeatMode, useQueue } from 'discord-player';
import { noQueue } from '../bot-responses/errors.js';

export const command = new SlashCommandBuilder()
  .setName('loop') // Command name
  .setDescription('Escolha um modo de loop') // Command description
  .addNumberOption((option) =>
    option
      .setName('mode') // Option name
      .setDescription('Modo de loop') // Option description
      .setRequired(true) // Option is required
      .addChoices(
        {
          name: 'Desligado',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Musica',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Fila',
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: 'Autoplay',
          value: QueueRepeatMode.AUTOPLAY,
        },
      ),
  );

const loopModes = {
  0: 'Desligado',
  1: 'Musica',
  2: 'Fila',
  3: 'Autoplay',
}

export async function execute(interaction) {
  // Get the current queue
  const queue = useQueue();

  if (!queue) {
    return interaction.reply(
      noQueue,
    );
  }

  // Get the loop mode
  const loopMode = interaction.options.getNumber('mode');

  // Set the loop mode
  queue.setRepeatMode(loopMode);

  // Send a confirmation message
  return interaction.reply(`Modo de Loop definido para ${loopModes[loopMode]}`);
}