import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Collection, EmbedBuilder, Events, InteractionType, ModalSubmitInteraction } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { ButtonRole, Guild } from "../../types";
import Command from "../../base/classes/Command";
import ButtonRoleType from "../../base/enums/ButtonRoleType";

export default class InteractionCreate extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.InteractionCreate,
            description: `Interaction create event`,
            once: false
        } )
    }

    async Execute( interaction: ChatInputCommandInteraction | AutocompleteInteraction | ButtonInteraction | ModalSubmitInteraction ) {

        let guildColor = this.client.defaultGuildThemeColor;
        if ( interaction.inGuild() ) {
            try {

                const { data: guild } = await this.client.botAxios.get< Guild >( `/guild/${ interaction.guildId }` );
                guildColor = guild.themecolor;

            } catch ( error ) {

                console.log( `Error fetching guild!`, error );

            }
        }
        const commandName: string = ( interaction as ChatInputCommandInteraction ).commandName ?? ``;
        const command: Command = this.client.commands.get( commandName )!;
        if ( !command && interaction.type === InteractionType.ApplicationCommand ) {

            console.error( `No command matching ${ commandName } was found.` );
            this.client.commands.delete( commandName )
            return;

        }

        if ( interaction.isAutocomplete() ) {

            try {

                await command.Autocomplete( interaction );

            } catch ( error ) {

                console.log( `Error executing command ${ commandName }`, error );

            }

        } else if ( interaction.isButton() && !interaction.customId.startsWith( 'pagination' ) && interaction.customId !== `steal` ) {

            if ( interaction.inGuild() ) {

                await interaction.deferReply( { ephemeral: true } );
                try {

                    const { data: buttonRoles } = await this.client.botAxios.get< ButtonRole[] >( `/guild/${ interaction.guildId }/buttonrole/message/${ interaction.message.id }/customid/${ interaction.customId }` );
                    
                    for ( const buttonRole of buttonRoles ) {

                        await this.client.subCommands.get( buttonRole.type === ButtonRoleType.Add ? `role.add`: `role.remove` )?.Execute( interaction, {
                            user: interaction.user.id,
                            role: buttonRole.roleid
                        } );

                    }

                    if ( interaction.customId !== 'enterbtn' )
                        await interaction.followUp( {
                            content: 'Button roles applied!',
                            ephemeral: true
                        } );
                    else
                        await interaction.followUp( {
                            content: `Access granted, welcome to the server!`,
                            ephemeral: true
                        } );

                } catch ( error ) {

                    console.log( 'Error fetching button roles!', error );
                    await interaction.followUp( {
                        content: `Error fetching button roles!`,
                        ephemeral: true
                    } );

                }                    

            }

        } else if ( interaction.isModalSubmit() ) {

            // console.log( `modal interaction`, interaction );

        }

        if ( !interaction.isChatInputCommand() ) return;

        const { cooldowns } = this.client;
        if ( !cooldowns.has( command.name ) ) cooldowns.set( command.name, new Collection() );
        
        const now = Date.now();
        const timestamps = cooldowns.get( command.name )!;
        const cooldownAmount = ( command.cooldown ?? 3 ) * 1000;

        if ( timestamps.has( interaction.user.id ) && ( now < ( timestamps.get( interaction.user.id ) || 0 ) + cooldownAmount ) )
            return await interaction.reply( { embeds: [ new EmbedBuilder()
                .setColor( guildColor ?? this.client.defaultGuildThemeColor )
                .setDescription( `Please wait another \`${ ( ( ( ( timestamps.get(  interaction.user.id ) || 0 ) + cooldownAmount ) - now ) / 1000 ).toFixed( 1 ) }\` seconds to run this command!` ) ], ephemeral: true } );
        timestamps.set( interaction.user.id, now );
        setTimeout( () => timestamps.delete( interaction.user.id ), cooldownAmount );
        
        try {

            const subCommandGroup = interaction.options.getSubcommandGroup( false );
            const subCommand = `${ commandName }${ subCommandGroup ? `.${ subCommandGroup }` : `` }.${ interaction.options.getSubcommand( false ) || `` }`;

            await this.client.subCommands.get( subCommand )?.Execute( interaction ) || await command.Execute( interaction );

        } catch ( error ) {

            console.log( `Error executing command ${ commandName }`, error );

        }

    }

}