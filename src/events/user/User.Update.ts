import { Events, User as DiscordUser } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { differenceInObj, getDefaultAvatarColor } from "../../UtilityMethods";
import { User } from "../../types";

export default class UserUpdate extends Event {
    
    constructor( client:CustomClient ) {
        super( client, {
            name: Events.UserUpdate,
            description: `User update event`,
            once: false
        } )
    }

    async Execute( oldUser: DiscordUser, newUser: DiscordUser ) {

        if ( this.client.userUpdateLog )
            console.log( `User ${ oldUser.id } updated!` );

        newUser = await newUser.fetch();

        if ( oldUser.displayName !== newUser.displayName || oldUser.displayAvatarURL() !== newUser.displayAvatarURL() || oldUser.bannerURL() !== newUser.bannerURL() || oldUser.accentColor !== newUser.accentColor ) {

            const { data: oldDBUser } = await this.client.botAxios.get< User >( `/user/${ oldUser.id }` );

            try {

                const { data: newDBUser } = await this.client.botAxios.post< User >( `/users`, {
                    id: newUser.id,
                    username: newUser.displayName,
                    avatar: newUser.displayAvatarURL(),
                    bot: newUser.bot,
                    createdTimestamp: newUser.createdTimestamp,
                    banner: newUser.bannerURL() ?? newUser.accentColor ?? getDefaultAvatarColor( newUser.displayAvatarURL() ),
                    mybot: newUser.id === this.client.user?.id
                } );
                if ( this.client.userUpdateLog )
                    console.log( `User ${ oldDBUser.id } updated!`, differenceInObj< User >( oldDBUser, newDBUser ) );

            } catch ( error ) {

                console.log( `Error updating user!`, error );

            }

        }

    }

}