import {User} from "./User";
import {Chat} from "./Chat";
import {Nothing} from "../../../types/Nothing";
import {Rank} from "../enums/Rank";
import {PermissionsModule} from "../database/modules/PermissionsModule";
import {PermissionQuery} from "../database/queries/PermissionQuery";
import {ManagerQuery} from "../database/queries/ManagerQuery";
import {ManagersModule} from "../database/modules/ManagersModule";
import {NicknamesModule} from "../database/modules/NicknamesModule";
import {NicknameQuery} from "../database/queries/NicknameQuery";
import {NameCase} from "../enums/NameCase";
import {WarnQuery} from "../database/queries/WarnQuery";
import {WarnsModule} from "../database/modules/WarnsModule";
import {StatisticMessage} from "../services/StatisticMessage";
import {Some} from "../../../types/Some";
import {Main} from "../../../../Main";
import {PunishmentsService} from "../services/PunishmentsService";
import {BanQuery} from "../database/queries/BanQuery";
import {BansModule} from "../database/modules/BansModule";

export class Member extends User {

    public chat: Chat;
    public rank!: Rank;
    public nick: string | null = null;
    public warns: WarnQuery[] = new Array<WarnQuery>()

    public constructor(userId: number, public chatId: number) {
        super(userId);
        this.chat = new Chat(chatId);
    }

    public async init() : Nothing {
        await super.init();
        const rankResults : PermissionQuery[] = await PermissionsModule.select({
            userId: this.userId,
            chatId: this.chatId
        }, {order: 'id', limit: 1})
        if (rankResults.length < 1) this.rank = Rank.DEFAULT;
        else this.rank = rankResults[0].role;

        const managerResults : ManagerQuery[] = await ManagersModule.select({
            userId: this.userId
        }, {order: 'id', limit: 1})
        if (managerResults.length > 0) this.rank = managerResults[0].rang;

        const nickResults : NicknameQuery[] = await NicknamesModule.select({
            userId: this.userId,
            chatId: this.chatId
        }, {order: 'id', limit: 1})
        if (nickResults.length > 0) this.nick = nickResults[0].nickname;

        this.warns = await WarnsModule.select({userId: this.userId, chatId: this.chatId, active: true})
    }

    public getWarnHistory = async () : Promise<WarnQuery[]> => await WarnsModule.select({userId: this.userId, chatId: this.chatId}, {order: 'id', limit: 10})

    public override async getFullName(nameCase: NameCase): Promise<string> {
        if (this.nick) return this.nick;
        return super.getFullName(nameCase);
    }

    public punishmentsService = () : PunishmentsService => new PunishmentsService(this)

    public async kick() : Promise<boolean> {
        await this.punishmentsService().removeRank();
        return await Main.getApi().kickUserFromChat(this.userId, this.chatId)
    }

    public async getChatBan() : Promise<BanQuery | null> {
        const res = await BansModule.select({
            userId: this.userId,
            chatId: this.chatId
        }, {order: 'id', limit: 1})
        return res.length < 1 ? null : res[0]
    }

    public getStatistic = () => new StatisticMessage(this);

    public static async create(userId: number, chatId: number) : Promise<Member> {
        const member : Member = new Member(userId, chatId);
        await member.init();
        return member;
    }

}