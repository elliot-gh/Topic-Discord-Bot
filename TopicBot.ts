import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Intents, TextChannel, MessageEmbed } from "discord.js";
import { BotInterface } from "../../BotInterface";

export class TopicBot implements BotInterface {
    intents: number[];
    slashCommands: [SlashCommandBuilder];
    private slashTopic: SlashCommandBuilder;

    constructor() {
        this.intents = [Intents.FLAGS.GUILDS];
        this.slashTopic = new SlashCommandBuilder()
            .setName("topic")
            .setDescription("Sets this channel's topic.")
            .addStringOption((option) =>
                option
                    .setName("topic")
                    .setDescription("The topic to set. Blank to clear topic.")
            ) as SlashCommandBuilder;
        this.slashCommands = [this.slashTopic];
    }

    async processSlashCommand(interaction: CommandInteraction): Promise<void> {
        console.log(`[TopicBot] got interaction: ${interaction}`);
        try {
            if (interaction.commandName === this.slashTopic.name) {
                const topic = interaction.options.getString("topic", false);

                const channel = interaction.channel as TextChannel;
                await channel.setTopic(topic);

                let description = `Cleared the topic for #${channel.name}`;
                if (topic !== null) {
                    description = `Set #${channel.name} topic to ${topic}`;
                }

                await interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setTitle("Success")
                        .setDescription(description)
                        .setColor(0x00FF00)
                ]});
            }
        } catch (error) {
            console.error(`[TopicBot] Got error: ${error}`);
            await interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle("Failure")
                    .setDescription(`Failed to set topic: \`${error}\``)
                    .setColor(0xFF0000)
            ]});
        }
    }
}
