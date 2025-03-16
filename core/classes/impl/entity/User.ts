import {IUser} from "../../../interfaces/entity/IUser";
import {GlobalBanQuery} from "../database/queries/GlobalBanQuery";
import {Nothing} from "../../../types/Nothing";
import {GlobalBansModule} from "../database/modules/GlobalBansModule";
import {FirstMessagesModule} from "../database/modules/FirstMessagesModule";
import {IdQuery} from "../database/queries/IdQuery";
import {NameCase} from "../enums/NameCase";
import {Main} from "../../../../Main";
import axios from "axios";
import {Time} from "../utils/Time";
import {BanQuery} from "../database/queries/BanQuery";
import {BansModule} from "../database/modules/BansModule";

export class User implements IUser {

    public stringUserId : string;
    public globalBan : GlobalBanQuery | null = null;
    public bans: BanQuery[] = new Array<BanQuery>();

    public constructor(public userId : number) {
        this.stringUserId = String(userId);
    }

    async init() : Nothing {
        const result : GlobalBanQuery[] = await GlobalBansModule.select({userId: this.userId})
        if (result.length > 0) this.globalBan = result[0];

        this.bans = await BansModule.select({userId: this.userId})
    }

    public async isFirstMessage(set: boolean = false) : Promise<boolean> {
        const result : IdQuery[] = await FirstMessagesModule.select({
            userId: this.userId
        })

        if (set) await FirstMessagesModule.create({
            userId: this.userId
        })

        return result.length < 1;
    }

    public isBot = () : boolean => this.userId < 1

    public async getFullName(nameCase: NameCase) : Promise<string> {
        if (this.userId === 0) return nameCase.console;
        else if (this.userId < 0) return await Main.getApi().getGroupName(this.userId);
        else return await Main.getApi().getUserName(this.userId, nameCase)
    }

    public async getMention(nameCase: NameCase) : Promise<string> {
        if (this.userId === 0) return nameCase.console;
        else if (this.userId < 0) return `[club${Math.abs(this.userId)}|${await this.getFullName(nameCase)}]`;
        else return `[id${this.userId}|${await this.getFullName(nameCase)}]`
    }

    public getOnlyMention(text: string) : string {
        if (this.userId === 0) return 'Консоль'
        else if (this.isBot()) return `[club${Math.abs(this.userId)}|${text}]`
        else return `[id${this.userId}|${text}]`
    }

    public static async instanceByTag(tag: string) : Promise<User> {
        let id : number | null = await Main.getApi().getUserByTag(tag);
        if (!id) {
            const res = await Main.getApi().getGroupByTag(tag)
            id = res - (res * 2);
        }
        const user : User = new User(id);
        await user.init();
        return user;
    }

    public async getVKRegistrationTime() : Promise<Time> {
        const res = await axios.get(`https://vk.com/foaf.php?id=${this.userId}`)
        const xml = res.data

        const dateRegex = /<ya:created\s+dc:date="([^"]+)"/;
        const match = xml.match(dateRegex);

        if (!match || match.length < 2) return new Time(new Date())

        return new Time(new Date(match[1]))
    }

    public static async instance(userId: number) : Promise<User> {
        const user : User = new User(userId);
        await user.init();
        return user;
    }

}