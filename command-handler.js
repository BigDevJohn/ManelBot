import { useMainPlayer } from 'discord-player';
import { commands } from './commands/index.js';

export async function handleInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  const player = useMainPlayer();

  const data = {
    guild: interaction.guild,
  };

  try {
    await player.context.provide(data, () => command.execute(interaction));
  } catch (error) {
    console.error(error);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply('Deu erro ao executar o comando!');
    } else {
      await interaction.reply('Deu erro ao executar o comando!');
    }
  }
}