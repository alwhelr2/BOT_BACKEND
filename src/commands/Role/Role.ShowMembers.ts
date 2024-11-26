import { APIEmbed, ChatInputCommandInteraction, userMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { AxiosError } from "axios";
import { Guild } from "../../types";
import Pagination from "../../base/classes/Pagination";

export default class RoleShowMembers extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.showmembers`
        } )
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {
        
        if ( !interaction.inGuild() ) return;
        let guildColor = this.client.defaultGuildThemeColor;
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
            guildColor = guild.themecolor;


        } catch ( error ) {

            console.log( `Error fetching guild!`, error instanceof AxiosError ? error.response?.data : error );

        }
        const role = interaction.options.getRole( `role` )!;
        await interaction.guild?.members.fetch();
        const guildRole = await interaction.guild?.roles.fetch( role.id );
        const pageDescriptions = [];
        for ( let i = 0; i < ( guildRole?.members?.size ?? 0 ); i+=5 ) {

            let line = ``;
            for ( let j = 0; j < 5; j++ ) {

                if ( ( i + j ) < ( guildRole?.members?.size ?? 0 ) ) {

                    line += `${ userMention( guildRole!.members.at( i + j )!.id ) }`;
                    if ( j < 9 ) line += `\n`;

                }
                else break;

            }
            pageDescriptions.push( line );

        }
        const embeds: APIEmbed[] = pageDescriptions.length > 0 ? pageDescriptions.map( ( description ) => {

            return {
                title: `${ role.name } Members:`,
                description: description,
                color: guildColor
            };

        } ) : [ {
            title: `${ role.name } Members:`,
            color: guildColor
        } ];
        await new Pagination( embeds, interaction ).DisplayEmbedPagination();

    }

}
