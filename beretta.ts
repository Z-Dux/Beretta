import { Client } from "npm:discord.js-selfbot-v13";
import { Logger } from "./structs/utils.ts";
import config from "./config.json" with { type: "json" };
import { Message } from "npm:discord.js-selfbot-v13";
import { walk } from "https://deno.land/std@0.193.0/fs/walk.ts";
import { config as loadEnv } from "npm:dotenv";
loadEnv()
export interface Command {
  name: string;
  description?: string;
  aliases?: string[];
  run: (message: Message, beretta: Beretta, args: string[]) => Promise<void>;
}

export class Beretta {
  client: Client<true> = new Client();
  token: string;
  private commands: Map<string, Command> = new Map();

  constructor(token: string) {
    this.token = token;
    this.login();
  }

  run() {
    this.client.on("ready", () => {
      Logger.success(`Logged in as ${this.client.user?.username}`);
      this.loadCommands();
    });
    this.client.on("messageCreate", async (message) => {
      await this.handle(message);
    });
  }

  login() {
    this.client.login(this.token).catch((err) => Logger.error(err.message));
  }

  async loadCommands() {
    const commandsPath = `${Deno.cwd()}/commands`;
    let loaded = 0;
    for await (const entry of walk(commandsPath, { exts: ["ts"] })) {
        
      if (!entry.isFile) continue;

      try {
        const command = (await import(`file://${entry.path}`)).default as Command;
        this.commands.set(command.name, command);

        if (command.aliases) {
          for (const alias of command.aliases) {
            this.commands.set(alias, command);
          }
        }

        loaded++;
      } catch (error) {
        Logger.error(`Failed to load command from ${entry.path}: ${error}`);
      }
    }
    Logger.info(`Loaded ${loaded} (/) commands!`)
  }

  async handle(message: Message) {
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
      return;
    }

    if (message.author.id != this.client.user.id) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = this.commands.get(commandName);
    if (!command) return;

    try {
      await command.run(message, this, args);
    } catch (error) {
      Logger.error(`Error executing command ${command.name}: ${error}`);
    }
  }
}