import { SlashCommandBuilder, EmbedBuilder, MessageFlags  } from 'discord.js';

export const command = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Mostra todos os comandos disponíveis');

export async function execute(interaction) {
  const commands = await interaction.guild.commands.fetch();

  if (!commands || commands.size === 0) {
    return interaction.reply({ content: 'Nenhum comando encontrado.', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setTitle('📖 Comandos disponíveis')
    .setColor(0x5865F2)
    .setDescription(
      commands
        .map(cmd => `**/${cmd.name}** — ${cmd.description}`)
        .sort()
        .join('\n')
    )
    .setFooter({ text: `Total: ${commands.size} comando(s)` });

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}