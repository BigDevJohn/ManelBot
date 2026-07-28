import { Client, GatewayIntentBits, ApplicationCommandOptionType } from "discord.js";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { handleInteraction } from "./command-handler.js";
import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds
    ]
});
client.login(token);

client.once('ready', () => {
 console.log('Ready!');
});

const player = new Player(client);

await player.extractors.loadMulti(YoutubeiExtractor);


player.events.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.events.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
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

player.events.on("botDisconnect", (queue) => {
    queue.metadata.send("Pô, aí você me alopra, me desconectou do canal de voz.");
});

player.events.on("channelEmpty", (queue) => {
    queue.metadata.send("Rapaziada, não tem mais ninguém no canal de voz. Saindo");
});

player.events.on("queueEnd", (queue) => {
    queue.metadata.send("A fila acabou man, se quiser me chamar de novo... é só chamar ksksksksks.");
});

client.on("messageCreate", async (message) => {
        if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();
});

client.on("messageCreate", async (message) => {

        if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
            {
                name: "play",
                description: "Plays a song from youtube",
                options: [
                    {
                        name: "song",
                        type: ApplicationCommandOptionType.String,
                        description: "The song you want to play",
                        required: true
                    }
                ]
            },
            {
                name: "remove",
                description: "Remove a song from the queue",
            },
            {
                name: "skip",
                description: "Skip to the current song"
            },
            {
                name: "queue",
                description: "See the queue"
            },
            {
                name: "stop",
                description: "Stop the player"
            },
        ]);

        await message.reply("Deployed!");
    }
});

// Sem isso, nenhum slash command é executado quando o usuário chama /play
client.on("interactionCreate", handleInteraction);