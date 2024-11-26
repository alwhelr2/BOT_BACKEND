import { Events, Presence } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { User } from "../../types";

export default class PresenceUpdate extends Event {

    constructor( client: CustomClient ) {
        super( client, {
            name: Events.PresenceUpdate,
            description: `User update event`,
            once: false
        } )
    }

    async Execute( oldPresence: Presence | null, newPresence: Presence ) {

        if ( this.client.userUpdateLog ) 
            console.log( `Member ${ oldPresence?.userId } presence updated from ${ oldPresence?.status } to ${ newPresence.status }${ newPresence.activities.length > 0 ? ` with ${ newPresence.activities[ 0 ].name }: ${ newPresence.activities[ 0 ].state }` : `` }` );

        try {

            if ( ( newPresence.activities.length ?? 0 ) > 0 && newPresence.activities[ 0 ].name === `Custom Status` && newPresence.activities[ 0 ].state ) {

                const { data: newDBUser } = await this.client.botAxios.post< User >( `/users`, {
                    id: newPresence.userId,
                    status: newPresence.activities[ 0 ].state,
                    avatar: newPresence.member?.displayAvatarURL(),
                    createdTimestamp: newPresence.user?.createdTimestamp
                } );
                if ( this.client.userUpdateLog )
                    console.log( `User ${ newDBUser.id } status updated!`, newDBUser.status );

            }

        } catch ( error ) {

            console.log( 'Error updating user status!', error );

        }

    }

}