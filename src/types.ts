import ButtonRoleType from "./base/enums/ButtonRoleType";
import TriggerType from "./base/enums/TriggerType";

export type Trigger = {
    text: string;
    response: string;
    type: TriggerType;
    chance: number;
    id: string;
    enabled: boolean;
    triggerbyuser?: string | null;
    guildid?: string | null;
    channelid?: string | null;
}

export type User = {
    id: string;
    username: string;
    avatar: string;
    bot: boolean;
    createdTimestamp: number;
    banner?: string;
    mybot: boolean;
    status?: string;
    birthdaymonth?: string;
    birthdaydate?: number;
    birthdayreminder: boolean;
    user_guilds: Guild[];
    triggers: Trigger[];
}

export type Guild = {
    id: string;
    name: string;
    themecolor: number;
    commandalias: string;
    joinleavelogchannel?: string;
    messagelogchannel?: string;
    iconURL?: string;
    owner: string;
    joinrole?: string;
    birthdaychannel?: string;
    starboardchannel?: string;
    starboardlimit: number;
    starboardenabled: boolean;
    starboardselfstar: boolean;
    guild_users: User[];
    triggers: Trigger[];
    reactionroles: ReactionRole[];
}

export type ReactionRole = {
    emojiid: string;
    roleid: string;
    messageid: string;
    guildid: string;
    uniquereact: boolean;
}

export type ButtonRole = {
    customid: string;
    roleid: string;
    messageid: string;
    guildid: string;
    type: ButtonRoleType;
}

export type GuildUser = {
    guildid: string;
    userid: string;
    birthdayreminder: boolean;
}

export type EmojiDictionary = { 
    [ index: string ]: {
        combos: string[],
        comboResults: {
            [ index: string ]: {
                date: string,
                url: string,
                alt: string
            }
        }
    }
}

export type UnicodeEmoji = {
    slug: string;
    character: string;
    unicodeName: string;
    codePoint: string;
    group: string;
    subGroup: string;
}

export type EmojiCategory = {
    slug: string;
    subCategories: string[]
}