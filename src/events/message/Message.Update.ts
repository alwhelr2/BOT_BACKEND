import { Events, Message } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class MessageUpdate extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.MessageUpdate,
            description: `Message update event`,
            once: false
        } );
    }

    Execute( oldMessage: Message, newMessage: Message ) {

        // console.log( `Message updated!` );
        // console.log( `oldMessage`, oldMessage );
        // console.log( `newMessage`, newMessage );

    }

}