import { Message, TextChannel } from "discord.js";

export function randomNumber( max: number ) {
    return Math.floor( Math.random() * max );
}

export function rng( chance: number ) {
    return randomNumber( chance ) === 0;
}

export function getRandomArrayElement<T>( array: T[] ): T {
    return array[ Math.floor( Math.random() * array.length ) ];
}

export function getCustomEmojis( message: string ) {
    return message.matchAll( /<a?:.+?:\d{17,19}>/gu );
}

export function getUnicodeEmojis( message: string ) {
    return message.matchAll( /\p{Extended_Pictographic}/gu );
}

export function getDefaultAvatarColor( avatarURL: string ): string | null {
    const name = avatarURL.substring( avatarURL.lastIndexOf( '/' ) + 1 );
    switch ( name ) {
        case '0.png':
            return '5793266';
        case '1.png':
            return '7700106'
        case '2.png':
            return '3908956';
        case '3.png':
            return '16426522';
        case '4.png':
            return '15548997';
        case '5.png':
            return '15418783';
        default:
            return null;
    }
}

export function calculateNumberSuffix( number: number ) {

    const j = number % 10, k = number / 100;
    if ( j === 1 && k !== 11 ) return `${ number }st`;
    if ( j === 2 && k !== 12 ) return `${ number }nd`;
    if ( j === 3 && k !== 13 ) return `${ number }rd`;

    return `${ number }th`;

}

export function differenceInObj< OBJType >( firstObj: OBJType, secondObj: OBJType ): OBJType {

    const differenceObj = {} as OBJType;
    for ( const key in firstObj ) {
        if ( Object.prototype.hasOwnProperty.call( firstObj, key ) ) {

            if( firstObj[ key ] !== secondObj[ key ] ) {
                if ( !Array.isArray( firstObj[ key ] ) )
                    differenceObj[ key ] = secondObj[ key ];
                else {

                    const arrayA = ( firstObj[ key ] as any[] );
                    const arrayB = ( secondObj[ key ] as any[] );
                    
                    const diffArray = arrayB?.filter( ( x: any ) => !arrayA.includes( x ) ) ?? [];
                    if ( diffArray?.length > 0 ) differenceObj[ key ] = diffArray as OBJType[ Extract< keyof OBJType, string > ];

                }
            }
            
        }
    }

    return differenceObj;

}

export async function getAllMessages( channel: TextChannel ) {

    let last_id;
    const all_messages: Message[] = [];

    while ( true ) {

        const options = { limit: 100 };
        if ( last_id ) ( options as any ).before = last_id;

        const messages = await channel.messages.fetch( options );
        all_messages.push( ...messages.values() );

        last_id = messages.last()?.id;

        if ( messages.size !== 100 ) break;

    }

    return all_messages;

}