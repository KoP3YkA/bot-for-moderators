import {User} from "./User";
import {Some} from "../../../types/Some";
import {ModeratorsModule} from "../database/modules/ModeratorsModule";
import {ModeratorQuery} from "../database/queries/ModeratorQuery";
import {ModeratorRank} from "../enums/ModeratorRank";
import {PanelModeratorRank} from "../enums/PanelModeratorRank";
import {Time} from "../utils/Time";
import {ModeratorStatistic} from "../services/ModeratorStatistic";
import {ModeratorType} from "../enums/ModeratorType";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {Main} from "../../../../Main";
import {Cash} from "../../../namespaces/Cash";
import {AdminsModule} from "../database/modules/AdminsModule";
import {AdminQuery} from "../database/queries/AdminQuery";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {KeyboardBuilder} from "vk-io";
import {ButtonAdapter} from "../adapter/ButtonAdapter";

export class Moderator extends User {

    public moderatorType!: ModeratorType;
    public rank!: ModeratorRank | PanelModeratorRank;
    public nick!: string;
    public firstAppointment!: Time;
    public lastAppointment!: Time;
    public hasPC!: boolean;
    public points!: number;
    public discord!: string;
    public forum!: string;
    public age!: number;
    public aban!: boolean;

    public preds!: number
    public warns!: number

    public constructor(userId: number) {
        super(userId);
    }

    public async isExists() : Promise<boolean> {
        if (Cash.MODERATORS.has(this.userId)) return true;
        const results : ModeratorQuery[] = await ModeratorsModule.select({userId: this.userId})
        const res = results.length > 0
        if (res) Cash.MODERATORS.add(this.userId)
        return res;
    }

    public async isAdmin() : Promise<boolean> {
        const results : AdminQuery[] = await AdminsModule.select({userId: this.userId}, {order: 'id', limit: 1})
        return results.length > 0
    }

    public async getHead(withAdmins : boolean = false) : Promise<Moderator[]> {
        const chiefRes = await ModeratorsModule.select({rang: ModeratorRank.CHIEF.tag, moderatorType: ModeratorType.BASIC.tag})
        let moders : Moderator[] = [];
        for (const i of chiefRes) {
            moders.push(new Moderator(i.userId))
        }

        if (!withAdmins) return moders
        const adminsRes = await AdminsModule.select({})
        for (const i of adminsRes) {
            moders.push(new Moderator(i.userId))
        }
        return moders
    }

    public async init() : Some {
        await super.init()
        const results : ModeratorQuery[] = await ModeratorsModule.select({userId: this.userId}, {order: 'id', limit: 1})
        if (results.length < 1) return;
        const moderator : ModeratorQuery = results[0];
        this.moderatorType = moderator.moderatorType;
        this.rank = this.moderatorType === ModeratorType.BASIC ? ModeratorRank.findByTag(moderator.rang) : PanelModeratorRank.findByTag(moderator.rang)
        this.nick = moderator.nickname;
        this.firstAppointment = moderator.firstAppointment;
        this.lastAppointment = moderator.lastAppointment;
        this.hasPC = moderator.hasPc;
        this.points = moderator.points;
        this.discord = moderator.discord;
        this.forum = moderator.forum;
        this.age = moderator.age;
        this.preds = moderator.preds;
        this.warns = moderator.vigs;
        this.aban = moderator.aban;
    }

    public async send(message: string | MessagesSendParams, ...buttons: PayloadButton[]) {
        const keyboard : KeyboardBuilder = ButtonAdapter.getCallbackButtons(buttons);
        await Main.getApi().sendMessage(typeof message === 'string' ? {message: message, peer_id: this.userId, random_id: 0, keyboard} : {...message, peer_id: this.userId, random_id: 0, keyboard}).catch(err => {return err})
    }

    public getStatisticService = () : ModeratorStatistic => new ModeratorStatistic(this);

}