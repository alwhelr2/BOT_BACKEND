import { ApplicationCommandOptionType, AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import axios, { AxiosInstance } from "axios";

export default class MinecraftRecipe extends Command {

    minecraftRecipeAxios: AxiosInstance;

    constructor( client: CustomClient ) {
        super( client, {
            name: `minecraftrecipe`,
            description: `Get the minecraft recipe for a certain item`,
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: [ {
                name: `item`,
                description: `The item you want the recipe for`,
                required: true,
                type: ApplicationCommandOptionType.String
            } ]
        } );
        this.minecraftRecipeAxios = axios.create( { baseURL: `https://www.minecraftcrafting.info` } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {
        
        const item = interaction.options.getString( `item` )!;
        await interaction.deferReply();
        
        try {

            const url = `/imgs/craft_${ item.toLowerCase().trim().replaceAll( ' ', '' ) }.gif`;
            await this.minecraftRecipeAxios.get( url );
            const attachment = new AttachmentBuilder( `https://www.minecraftcrafting.info${ url }`, { name: `recipe.gif` } );
            const embed = new EmbedBuilder().setColor( this.client.defaultGuildThemeColor ).setImage( `attachment://recipe.gif` ).setTitle( `Recipe For ${ item }:` );
            await interaction.followUp( {
                files: [ attachment ],
                embeds: [ embed ]
            } );

        } catch ( error ) {

            try {

                const url = `/imgs/craft_${ item.toLowerCase().trim().replaceAll( ' ', '' ) }.png`;
                await this.minecraftRecipeAxios.get( url );
                const attachment = new AttachmentBuilder( `https://www.minecraftcrafting.info${ url }`, { name: `recipe.png` } );
                const embed = new EmbedBuilder().setColor( this.client.defaultGuildThemeColor ).setImage( `attachment://recipe.png` ).setTitle( `Recipe For ${ item }:` );
                await interaction.followUp( {
                    files: [ attachment ],
                    embeds: [ embed ]
                } );

            } catch ( error ) {

                console.log( `Error fetching Minecraft recipe for ${ item }!`, error );
                await interaction.followUp( `Error fetching Minecraft recipe for ${ item }!` );

            }

        }
        

    }

}