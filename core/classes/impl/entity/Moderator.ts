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

    public preds!: number
    public warns!: number

    public constructor(userId: number) {
        super(userId);
    }

    public async isExists() : Promise<boolean> {
        const results : ModeratorQuery[] = await ModeratorsModule.select({userId: this.userId})
        return results.length > 0
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
    }

    public async send(message: string | MessagesSendParams) {
        await Main.getApi().sendMessage(typeof message === 'string' ? {message: message, peer_id: this.userId, random_id: 0} : {...message, peer_id: this.userId, random_id: 0}).catch(err => {return err})
    }

    public getStatisticService = () : ModeratorStatistic => new ModeratorStatistic(this);

}