import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import axios, { AxiosInstance } from "axios";

export default class MusicKeyInfo extends Command {

    modeNoteDictionary = [
        [ 0, 2, 4, 5, 7, 9, 11 ],
        [ 0, 2, 3, 5, 7, 9, 10 ],
        [ 0, 1, 3, 5, 7, 8, 10 ],
        [ 0, 2, 4, 6, 7, 9, 11 ],
        [ 0, 2, 4, 5, 7, 9, 10 ],
        [ 0, 2, 3, 5, 7, 8, 10 ],
        [ 0, 1, 3, 5, 6, 8, 10 ]
    ];
    modeChordDictionary = [
        [ ``, `m`, `m`, ``, ``, `m`, `°` ],
        [ `m`, `m`, ``, ``, `m`, `°`, `` ],
        [ `m`, ``, ``, `m`, `°`, ``, `m` ],
        [ ``, ``, `m`, `°`, ``, `m`, `m` ],
        [ ``, `m`, `°`, ``, `m`, `m`, `` ],
        [ `m`, `°`, ``, `m`, `m`, ``, `` ],
        [ `°`, ``, `m`, `m`, ``, ``, `m` ]
    ];
    notes = [ `A`, `Bb`, `B`, `C`, `C#`, `D`, `Eb`, `E`, `F`, `F#`, `G`, `Ab` ];
    altnotes = [ `A`, `A#`, `B`, `C`, `Db`, `D`, `D#`, `E`, `F`, `Gb`, `G`, `G#` ];
    modes = [ `Ionian`, `Dorian`, `Phrygian`, `Lydian`, `Mixolydian`, `Aeolian`, `Locrian` ];
    guitarScaleAxios: AxiosInstance = axios.create( { baseURL: 'https://www.guitarscale.org/images' } );

    constructor( client: CustomClient ) {
        super( client, {
            name: `musickeyinfo`,
            description: `Get the info for a musical key`,
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: [ {
                name: `pitch`,
                description: `The pitch of the key`,
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: `A`, value: `A` },
                    { name: `Bb`, value: `Bb` },
                    { name: `B`, value: `B` },
                    { name: `C`, value: `C` },
                    { name: `C#`, value: `C#` },
                    { name: `D`, value: `D` },
                    { name: `Eb`, value: `Eb` },
                    { name: `E`, value: `E` },
                    { name: `F`, value: `F` },
                    { name: `F#`, value: `F#` },
                    { name: `G`, value: `G` },
                    { name: `Ab`, value: `Ab` }
                ]
            }, {
                name: `mode`,
                description: `The musical mode of the key`,
                required: true,
                type: ApplicationCommandOptionType.Integer,
                choices: [
                    { name: `Ionian`, value: 0 },
                    { name: `Dorian`, value: 1 },
                    { name: `Phrygian`, value: 2 },
                    { name: `Lydian`, value: 3 },
                    { name: `Mixolydian`, value: 4 },
                    { name: `Aeolian`, value: 5 },
                    { name: `Locrian`, value: 6 },

                ]
            } ]
        } );
    }

    async Execute( interaction: ChatInputCommandInteraction ) {
        
        const pitch = interaction.options.getString( `pitch` )!;
        const mode = interaction.options.getInteger( `mode` )!;
        const reorderedArray = [ ...this.notes.slice( this.notes.indexOf( pitch ) ), ...this.notes.slice( 0, this.notes.indexOf( pitch ) ) ];
        const reorderedAltArray = [ ...this.altnotes.slice( this.altnotes.indexOf( pitch ) ), ...this.altnotes.slice( 0, this.altnotes.indexOf( pitch ) ) ];
        const modeNotes = this.modeNoteDictionary[ mode ];
        const modeChords = this.modeChordDictionary[ mode ];
        const modeName = this.modes[ mode ];
        let imageURL = `${ pitch.replace( `#`, `sharp` ).toLowerCase() }_${ mode === 0 ? `major` : mode === 5 ? `minor` : modeName.toLowerCase() }_full_letters.png`;
        await interaction.deferReply();
        try {

            await this.guitarScaleAxios.get( `/${ imageURL }` );

        } catch ( error ) {

            imageURL = imageURL.replace( `_full`, `` );

        }

        const keyNotes: string[] = [];
        for ( let i = 0; i < modeNotes.length; i++ ) {

            if ( i > 0 && keyNotes[ i - 1 ][ 0 ] === reorderedArray[ modeNotes[ i ] ][ 0 ] ) keyNotes.push( `${ reorderedAltArray[ modeNotes[ i ] ] }${ modeChords[ i ] }`);
            else keyNotes.push( `${ reorderedArray[ modeNotes[ i ] ] }${ modeChords[ i ] }` );

        }
        await interaction.followUp( {
            embeds: [ {
                title: `Musical Key Info For ${ pitch } ${ modeName }`,
                description: `Notes: ${ keyNotes.map( ( note ) => note.replace( 'm', '' ).replace( '°', '' ) ).join( ', ' ) }\nChords: ${ keyNotes.join( ', ' ) }`,
                color: this.client.defaultGuildThemeColor,
                image: {
                    url: `https://www.guitarscale.org/images/${ imageURL }`
                }
            } ]
        } );

    }

}