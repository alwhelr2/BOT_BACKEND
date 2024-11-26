import { APIEmbed, ChatInputCommandInteraction, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { AxiosError } from "axios";
import { Guild } from "../../types";
import Pagination from "../../base/classes/Pagination";

export default class RoleShowAll extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.showall`
        } );
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {

        if ( !interaction.inGuild() ) return;
        const roles = await interaction.guild?.roles.fetch();
        let guildColor = this.client.defaultGuildThemeColor;
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
            guildColor = guild.themecolor;


        } catch ( error ) {

            console.log( `Error fetching guild!`, error instanceof AxiosError ? error.response?.data : error );

        }

        const pageDescriptions = [];
        for ( let i = 0; i < ( roles?.size ?? 0 ); i+=10 ) {

            let line = ``;
            for ( let j = 0; j < 10; j++ ) {

                if ( ( i + j ) < ( roles?.size ?? 0 ) ) {

                    line += `${ roleMention( roles!.at( i + j )!.id ) }`;
                    if ( j < 4 ) line += `\n`;

                }
                else break;

            }
            pageDescriptions.push( line );

        }

        const embeds: APIEmbed[] = pageDescriptions.map( ( description ) => {

            return {
                title: `Roles: `,
                description: description,
                color: guildColor
            };

        } );
        await new Pagination( embeds, interaction ).DisplayEmbedPagination();
        
    }

}