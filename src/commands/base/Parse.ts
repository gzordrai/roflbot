import { ApplicationCommandOptionType, AttachmentBuilder, CommandInteraction, Message } from "discord.js";
import { Metadata, ROFLParser } from "rofl-parser.js";
import { BaseCommand, Command } from "azuria";
import axios from "axios";
import { BotConfig } from "../../config";


@Command({
    name: "parse",
    description: "Parse a ROFL file into a JSON file",
    options: [
        {
            name: "file",
            description: "The ROFL file to parse",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        }
    ]
})
export class Parse extends BaseCommand<BotConfig> {
    public readonly ephemeral = true;

    public async execute(interaction: CommandInteraction): Promise<void | Message<boolean>> {
        const file = interaction.options.get("file");

        if (!file?.attachment?.url)
            return interaction.followUp("No file provided.");

        const url: string = file.attachment.url;

        interaction.followUp("Parsing the file...");

        axios.get(url, { responseType: "arraybuffer" })
            .then(response => {
                const data: Buffer = response.data;
                const parser: ROFLParser = new ROFLParser(data);
                const metadata: Metadata = parser.parse();
                const buffer: Buffer = metadata.toBuffer();
                const attachment = new AttachmentBuilder(buffer)
                    .setName(`${file.attachment?.name}.json`);

                interaction.followUp({ content: "The file has been parsed.", files: [attachment] });
            })
            .catch(error => {
                this.client.logger.error(error);

                interaction.followUp({ content: "An error occurred while parsing the file.", ephemeral: true });
            });
    }
}