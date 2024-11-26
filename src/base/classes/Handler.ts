/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { glob } from "glob";
import IHandler from "../interfaces/IHandler";
import path from 'path';
import CustomClient from "./CustomClient";
import Event from "./Event";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { ClientEvents } from "discord.js";

export default class Handler implements IHandler {

    client: CustomClient;

    constructor( client: CustomClient ) {
        this.client = client;
    }

    async LoadEvents() {
        const files = ( await glob( `build/events/**/*.js` ) ).map( filePath => path.resolve( filePath ) );
        
        files.map( async ( file: string ) => {
            const event: Event = new ( await import( file ) ).default( this.client );

            if ( !event.name ) return delete require.cache[ require.resolve( file ) ] && console.log( `${ file.split( `/`).pop() } does not have a name.` );
        
            const execute = ( ...args: any ) => event.Execute( ...args );

            if ( event.once ) this.client.once( event.name as keyof ClientEvents, execute );
            else this.client.on( event.name as keyof ClientEvents, execute );

            return delete require.cache[ require.resolve( file ) ];

        } );
    }

    async LoadCommands() {
        const files = ( await glob( `build/commands/**/*.js` ) ).map( filePath => path.resolve( filePath ) );
        
        files.map( async ( file: string ) => {
            const command: Command | SubCommand = new ( await import( file ) ).default( this.client );

            if ( !command.name )
                return delete require.cache[ require.resolve( file ) ] && console.log( `${ file.split( `/`).pop() } does not have a name.` );

            if ( file.split( `/` ).pop()?.split( `.` )[ 2 ] )
                return this.client.subCommands.set( command.name, command );

            this.client.commands.set( command.name, command as Command );

            return delete require.cache[ require.resolve( file ) ];

        } );
    }
}