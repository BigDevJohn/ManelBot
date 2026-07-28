import { Collection } from 'discord.js';
import * as play from './play.js';
import * as skip from './skip.js';
import * as stop from './stop.js';
import * as queue from './queue.js';
import * as remove from './remove.js';

// Adicione aqui os outros comandos (skip, stop, queue, remove) quando existirem
const commandModules = [play, skip, stop, queue, remove];

export const commands = new Collection(
  commandModules.map((mod) => [mod.command.name, mod]),
);