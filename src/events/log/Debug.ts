import { Events } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class Debug extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.Debug,
            description: "Debug event",
            once: false
        } );
    }

    Execute(  info: string  ) {

        if ( this.client.debugLog )
            console.info( `Debug`, info );

    }

}