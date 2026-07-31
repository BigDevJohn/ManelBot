import { Client, GatewayIntentBits, ApplicationCommandOptionType } from "discord.js";
import { Player } from "discord-player";
import pkg from "@discord-player/extractor";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { handleInteraction } from "./command-handler.js";
import { commands } from './commands/main.js';
import 'dotenv/config';
const { DefaultExtractors } = pkg;


const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent

    ]
});
client.login(token);

client.once('clientReady', async () => {
    await client.application?.fetch();
    console.log('Ready!');
});

const player = new Player(client);

await player.extractors.register(YoutubeiExtractor,{});
await player.extractors.loadMulti(DefaultExtractors);


player.events.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.events.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});
player.events.on("playerError", (queue, error) => {
    console.log(`[${queue.guild.name}] Player error: ${error.message}`);
    console.log(error.stack);
});

player.events.on("playerStart", (queue, track) => {
    queue.metadata.send(`Bicho, agora vai tocar: **${track.title}**!`);
});

player.events.on("audioTrackAdd", (queue, track) => {
    queue.metadata.send(`Caralho, **${track.title}** ? Aí sim ein!`);
});

player.events.on("audioTrackRemove", (queue, track) => {
    queue.metadata.send(`Paia, mas beleza, **${track.title}** foi removida da fila.`);
});

player.events.on("disconnect", (queue) => {
    queue.metadata.send("Pô, aí você me alopra, me desconectou do canal de voz.");
});

player.events.on("emptyChannel", (queue) => {
    queue.metadata.send("Rapaziada, não tem mais ninguém no canal de voz. Saindo");
});

player.events.on("emptyQueue", (queue) => {
    queue.metadata.send("A fila acabou man, se quiser me chamar de novo... é só chamar ksksksksks.");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    if (message.author.id === client.application?.owner?.id) {
        if (message.content === "!test") {
            const commandsData = commands.map((mod) => mod.command.toJSON());

            await message.guild.commands.set(commandsData);

            await message.reply("Test Deployed!");
        } else if (message.content === "!deploy") {
            const commandsData = commands.map((mod) => mod.command.toJSON());

            await client.application.commands.set(commandsData);

            await message.reply("Commands Deployed!");


        }

    }
});

// Sem isso, nenhum slash command é executado quando o usuário chama /play
client.on("interactionCreate", handleInteraction);