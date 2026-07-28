import { Client, GuildMember, GatewayIntentBits } from "discord.js";
import { Player, QueryType } from "discord-player";
import config from "./config.json" with { type: "json" };

const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds
    ]
});
client.login(config.token);

client.once('ready', () => {
 console.log('Ready!');
});

const player = new Player(client);

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on("trackStart", (queue, track) => {
    queue.metadata.send(`Bicho, agora vai tocar: **${track.title}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`Caralho, **${track.title}** ? Aí sim ein!`);
});

player.on("trackRemove", (queue, track) => {
    queue.metadata.send(`Paia, mas beleza, **${track.title}** foi removida da fila.`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("Pô, aí você me alopra, me desconectou do canal de voz.");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("Rapaziada, não tem mais ninguém no canal de voz. Saindo");
});

player.on("queueEnd", (queue) => {
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
                        name: "query",
                        type: "STRING",
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
