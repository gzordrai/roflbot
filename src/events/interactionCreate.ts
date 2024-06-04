import { BaseEvent, Event } from "azuria";
import { CommandInteraction, Interaction } from "discord.js";
import { BotConfig } from "../config";

@Event("interactionCreate")
export class InteractionCreate extends BaseEvent<BotConfig> {
    public async execute(interaction: Interaction) {
        if (interaction.isCommand())
            await this.handleCommand(interaction);
    }

    private async handleCommand(interaction: CommandInteraction) {
        const command = this.client.commands.get(interaction.commandName);

        if (!command) return;

        if (!command.modal)
            await interaction.deferReply({ ephemeral: command.ephemeral ?? false });

        command.execute(interaction);
    }
}