import { ApplicationCommandOptionType, AttachmentBuilder, AutocompleteInteraction, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, Message, PermissionsBitField } from "discord.js";
import glitterData from "../../../data/glitterData.json";
import axios, { AxiosInstance } from "axios";
import { findAll } from "domutils";
import { parseDocument } from "htmlparser2";
import { getAverageColor } from "fast-average-color-node";
import Category from '../../base/enums/Category';
import Command from "../../base/classes/Command";
import { getRandomArrayElement, randomNumber } from "../../UtilityMethods";
import CustomClient from "../../base/classes/CustomClient";

export interface IGlitterOptions {
    text: string;
    size: number;
    border: boolean;
    glitter: string;
    font: string;
    embedDisplay: boolean;
    angle: number;
    shadow: boolean;
    borderwidth: number;
}

export default class GlitterText extends Command {

    glitterTextAxios: AxiosInstance;
    sizeStrings: number[];

    constructor( client: CustomClient ) {
        super( client, {
            name: 'glittertext',
            description: `Glizzy up your text, fool!`,
            category: Category.Miscellaneous,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: [ {
                name: `text`,
                description: `The text you want to glitter`,
                required: true,
                type: ApplicationCommandOptionType.String
            }, {
                name: `size`,
                description: `The size of the glitter text`,
                type: ApplicationCommandOptionType.Integer,
                choices: [
                    { name: `XX-Small` , value: 30 },
                    { name: `X-Small` , value: 40 },
                    { name: `Small` , value: 50 },
                    { name: `Medium` , value: 60 },
                    { name: `Large` , value: 70 },
                    { name: `X-Large` , value: 80 },
                    { name: `XX-Large` , value: 90 },
                ]
            }, { 
                name: `border`,
                description: `Border around the text or no`,
                type: ApplicationCommandOptionType.Boolean
            }, { 
                name: `glitter`,
                description: `Glitter for the glitter text`,
                type: ApplicationCommandOptionType.String,
                autocomplete: true
                
            }, { 
                name: `font`,
                description: `Font for the glitter text`,
                type: ApplicationCommandOptionType.String,
                autocomplete: true
            }, {
                name: `shadow`,
                description: `Shadow under the text or no`,
                type: ApplicationCommandOptionType.Boolean
            }, {
                name: `borderwidth`,
                description: `The size of the border`,
                type: ApplicationCommandOptionType.Integer,
                min_value: 0,
                max_value: 20
            }, {
                name: `angle`,
                description: `The angle of the text`,
                type: ApplicationCommandOptionType.Integer,
                min_value: 0,
                max_value: 359
            }, {
                name: `embeddisplay`,
                description: `Display the glitter text as an embed`,
                type: ApplicationCommandOptionType.Boolean
            } ]
        } );
        this.glitterTextAxios = axios.create( {
            baseURL: 'http://www.gigaglitters.com'
        } );
        this.sizeStrings = [
            30,
            40,
            50,
            60,
            70,
            80,
            90
        ];
    }
    
    async Autocomplete( interaction: AutocompleteInteraction ) {

        const focusedOption = interaction.options.getFocused( true );
        const glitterOption = focusedOption.name === `glitter`;
        const options = glitterOption ? glitterData.glitters : glitterData.fonts;
        await interaction.respond( options.filter( ( option: string ) => option.toLowerCase().includes( focusedOption.value.toLowerCase() ) ).map( ( option ) => { 
            return { name: option, value: option }; 
        } ).slice( 0, 25 ) );

    }

    async Execute( interaction: ChatInputCommandInteraction | Message, aliasOptions?: IGlitterOptions ) {

        const text = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options?.getString( `text` )! : aliasOptions?.text ?? `gigaglitters.com`;
        const size = ( interaction instanceof ChatInputCommandInteraction ) ? ( interaction.options?.getInteger( `size` ) ?? 60 ) : aliasOptions?.size ?? getRandomArrayElement( this.sizeStrings );
        const border = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options?.getBoolean( `border` ) ?? true : aliasOptions?.border ?? true;
        const glitter = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options?.getString( `glitter` ) ?? `random` : aliasOptions?.glitter ?? `random`;
        const font = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options?.getString( `font` ) ?? `random` : aliasOptions?.font ?? `random`;
        const embeddisplay = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options?.getBoolean( `embeddisplay` ) ?? false : aliasOptions?.embedDisplay ?? true;
        const angle = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options.getInteger( `angle` ) ?? 0 : aliasOptions?.angle ?? 0;
        const shadow = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options.getBoolean( `shadow` ) ?? true : aliasOptions?.shadow ?? true;
        const borderWidth = ( interaction instanceof ChatInputCommandInteraction ) ? interaction.options.getInteger( `borderwidth` ) ?? 0 : aliasOptions?.borderwidth ?? randomNumber( 20 );

        if ( ( glitter.toLowerCase() !== `random` && !glitterData.glitters.includes( glitter ) ) || ( font.toLowerCase() !== `random` && !glitterData.fonts.includes( font ) ) ) {

            await interaction.reply( { content: `You have entered an incorrect glitter or font, please select one from the autocomplete list.`, ephemeral: true } );
            return;

        }

        if ( interaction instanceof ChatInputCommandInteraction )
            await interaction.deferReply();
        const postData = {
            t: text.replaceAll( `'`, `` ),
            size: size,
            glitter: glitter.trim().toLowerCase() === `random` ? `img/${ getRandomArrayElement( glitterData.glitters ) }.gif` : `img/${ glitter }.gif`,
            loadFonth: font.trim().toLowerCase() === `random` ? getRandomArrayElement( glitterData.fonts ) : font,
            angle: angle,
            RadioGroup1: shadow ? 1 : 2,
            RadioGroup2: border ? 3 : 4,
            border: borderWidth,
            Submit: `Create Text`
        };

        const response = await this.glitterTextAxios.post( `/procesing.php`, postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } ).catch( async ( error ) => {
            console.log( `An error occurred using the glitterText API`, error );
            interaction instanceof Message ? await interaction.reply( `An error occurred using the glitterText API` ) : await interaction.followUp( `An error occurred using the glitterText API` );
        } );
        const url: string = `https://www.gigaglitters.com${ findAll( ( node ) => node.name === 'img' && node.attribs[ 'src' ].startsWith( `/created` ), parseDocument( response?.data as string ).childNodes )[ 0 ].attribs[ 'src' ] }`;
        const attachment = new AttachmentBuilder( url, { name: `glitter.gif` } );
        const averageColor = await getAverageColor( url );
        const embed = new EmbedBuilder().setColor( averageColor.hex as ColorResolvable ).setImage( `attachment://glitter.gif` ).setTitle( text );

        interaction instanceof Message ? await interaction.reply( { files: [ attachment ], embeds: embeddisplay ? [ embed ] : [] } ) : await interaction.followUp( { files: [ attachment ], embeds: embeddisplay ? [ embed ] : [] } ).catch();
    }
}