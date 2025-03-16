import {BaseUserService} from "../../base/services/BaseUserService";
import {Member} from "../entity/Member";
import {Some} from "../../../types/Some";
import {WarnsModule} from "../database/modules/WarnsModule";
import {PermissionsModule} from "../database/modules/PermissionsModule";
import {Rank} from "../enums/Rank";
import {NicknamesModule} from "../database/modules/NicknamesModule";
import {BansModule} from "../database/modules/BansModule";
import {GlobalBansModule} from "../database/modules/GlobalBansModule";

export class PunishmentsService extends BaseUserService {

    public user : Member;

    public constructor(user: Member) {
        super();
        this.user = user;
    }

    public async warn(moderator: number, reason: string) : Some {
        await WarnsModule.create({
            userId: this.user.userId,
            chatId: this.user.chatId,
            moderator,
            reason,
            date: new Date(),
        })
    }

    public async unwarn() : Some {
        const res = await WarnsModule.select({
            userId: this.user.userId,
            chatId: this.user.chatId,
            active: true
        }, {limit: 1})
        if (res.length < 1) return
        await WarnsModule.update({
            active: false
        }, {
            userId: this.user.userId,
            chatId: this.user.chatId,
            id: res[0].id
        })
    }

    public async clearWarns() : Some {
        const res = await WarnsModule.select({
            userId: this.user.userId,
            chatId: this.user.chatId,
            active: true
        })
        for (const i of res) {
            await WarnsModule.update({
                active: false
            }, {
                id: i.id
            })
        }
    }

    public async removeRank() : Some {
        await PermissionsModule.delete({
            userId: this.user.userId,
            chatId: this.user.chatId
        })
    }

    public async setRank(rank: Rank) : Some {
        await this.removeRank();
        await PermissionsModule.create({
            chatId: this.user.chatId,
            userId: this.user.userId,
            role: rank.tag
        })
    }

    public async setNick(nick: string | null) : Some {
        const where = {userId: this.user.userId, chatId: this.user.chatId}
        if (nick) {
            await NicknamesModule.delete(where)
            await NicknamesModule.create({...where, nickname: nick})
        } else {
            await NicknamesModule.delete(where)
        }
    }

    public async ban(moderator: number, reason: string) : Some {
        await BansModule.create({
            chatId: this.user.chatId,
            userId: this.user.userId,
            moderator: moderator,
            reason: reason,
            date: new Date(),
        })
    }

    public async unban() : Some {
        await BansModule.delete({
            userId: this.user.userId,
            chatId: this.user.chatId
        })
    }

    public async gban(moderator: number, reason: string) : Some {
        await GlobalBansModule.create({
            userId: this.user.userId,
            moderator,
            reason,
            date: new Date()
        })
    }

    public async gunban() : Some {
        await GlobalBansModule.delete({
            userId: this.user.userId
        })
    }

}