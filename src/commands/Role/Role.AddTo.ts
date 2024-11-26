import { ChatInputCommandInteraction, Colors, roleMention } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import { AxiosError } from "axios";
import { Guild } from "../../types";

export default class RoleAddTo extends SubCommand {

    constructor( client: CustomClient ) {
        super( client, {
            name: `role.addto`
        } )
    }
    
    async Execute( interaction: ChatInputCommandInteraction ) {
        
        if ( !interaction.inGuild() ) return;
        const role = interaction.options.getRole( `role` )!;
        const addTo = interaction.options.getRole( `add_to` )!;
        let guildColor = this.client.defaultGuildThemeColor;
        try {

            const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
            guildColor = guild.themecolor;


        } catch ( error ) {

            console.log( `Error fetching guild!`, error instanceof AxiosError ? error.response?.data : error );

        }

        await interaction.guild?.members.fetch();
        const existingRole = await interaction.guild?.roles.fetch( addTo.id );
        existingRole?.members.forEach( ( user ) => {

            void user.roles.add( role.id );

        } );

        await interaction.reply( {
            embeds: [ {
                title: `Success`,
                description: `Added ${ roleMention( role.id ) } to ${  existingRole?.members?.size ?? 0 } members.`,
                color: role.color === Colors.Default ? guildColor : role.color
            } ]
        } );

    }

}