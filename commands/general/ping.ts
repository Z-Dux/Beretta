import { Command } from "../../beretta.ts";
import { getTimeGap } from "../../structs/utils.ts";

const pingCommand: Command = {
    name: "ping",
    description: "Replies with Pong!",
    aliases: ["p"],
    run: async (message, _, __) => {
        try {
            const date = new Date();
            const msg = await message.reply("Pinging...");
            await msg.edit(`Pinged in ${getTimeGap(date)}`);
        } catch (error) {
            console.error(`Failed to execute ping command: ${error}`);
        }
    },
};

export default pingCommand;
