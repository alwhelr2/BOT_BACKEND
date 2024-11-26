import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import axios, { AxiosInstance } from "axios";

export default class Dictionary extends Command {

    dictionaryAPIAxios: AxiosInstance = axios.create( { baseURL: `https://api.dictionaryapi.dev/api/v2/entries/en` } );

    constructor( client: CustomClient ) {
        super( client, {
            name: 'dictionary',
            description: 'Dictionary command',
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 0,
            options: [ {
                name: `word`,
                description: `The word you want to look up`,
                required: true,
                type: ApplicationCommandOptionType.String
            } ]
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {

        const word = interaction.options.getString( `word` )!;
        await interaction.deferReply();

        try {

            const { data: results } = await this.dictionaryAPIAxios.get< { word: string, phonetic: string, meanings: { partOfSpeech: string, definitions: { definition: string, example?: string }[], synonyms: string[] }[] }[] >( `/${ word }` );
            const description = [];
            for ( const result of results ) {

                for ( const meaning of result.meanings ) {

                    description.push( `Part of speech: ${ meaning.partOfSpeech }` );
                    for ( const defintion of meaning.definitions ) {

                        description.push( `Definition: ${ defintion.definition }` );
                        if ( defintion.example ) description.push( `Example: ${ defintion.example }` );

                    }
                    if ( meaning.synonyms.length > 0 ) description.push( `Synonyms: ${ meaning.synonyms.join( ', ' ) }` );
                    description.push( `\n` );

                }

            }
            await interaction.followUp( {
                embeds: [ {
                    title: `${ word }`,
                    description: description.join( `\n` ),
                    color: this.client.defaultGuildThemeColor
                } ]
            } );

        } catch ( error ) {

            console.log( `Error fetching dictionary results!`, error );
            await interaction.followUp( `Error fetching dictionary results!` );

        }

    }

}