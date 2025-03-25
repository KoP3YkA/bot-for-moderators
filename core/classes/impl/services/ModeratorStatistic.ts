import {Moderator} from "../entity/Moderator";
import {Some} from "../../../types/Some";
import {ModeratorsModule} from "../database/modules/ModeratorsModule";
import {Cash} from "../../../namespaces/Cash";
import {AdminsModule} from "../database/modules/AdminsModule";

export class ModeratorStatistic {

    public constructor(public user: Moderator) {}

    public getStatisticMessage = () : string => {
        return `
👤 Ник — ${this.user.nick}
Ⓜ️ Направление — ${this.user.moderatorType.displayName}
☑️ Должность — ${this.user.rank.displayName}
⤴️ Послед. повышение — ${this.user.lastAppointment.getDaysDifference()} дней назад
💲 Баллы — ${this.user.points}
⚡ Возраст — ${this.user.age} лет

💻 Доступ к ПК — ${this.user.hasPC ? 'Есть' : 'Нет'}
📘 Discord — ${this.user.discord}
📕 Forum — ${this.user.forum}
🆔 VK ID — ${this.user.userId}

🅰️ Выговоры — ${this.user.warns}/3
🅱️ Предупреждения — ${this.user.preds}/2
${this.user.globalBan ? '\n‼️ Имеется глобальная блокировка! ‼️' : ''}
${this.user.aban ? '\n❄️ Права временно заморожены ❄️' : ''}
        `
    }

    public async editForum(newForum: string) : Some {
        await ModeratorsModule.update({forum: newForum}, {userId: this.user.userId})
    }

    public async editDiscord(newDiscord: string) : Some {
        await ModeratorsModule.update({discord: newDiscord}, {userId: this.user.userId})
    }

    public async editAge(age: number) : Some {
        await ModeratorsModule.update({age}, {userId: this.user.userId})
    }

    public async editPC(pc: boolean) : Some {
        await ModeratorsModule.update({hasPc: pc}, {userId: this.user.userId})
    }

    public async kick() : Some {
        await ModeratorsModule.delete({userId: this.user.userId})
        Cash.MODERATORS.delete(this.user.userId)
        await AdminsModule.delete({userId: this.user.userId})
    }

    public async setRank(rank: string) : Some {
        await ModeratorsModule.update({rang: rank, lastAppointment: new Date()}, {userId: this.user.userId})
    }

    public async warn(warnType: 'выговор' | 'предупреждение') : Some {
        await ModeratorsModule.update(warnType === 'выговор' ? {vigs: this.user.warns+1} : {preds: this.user.preds+1}, {userId: this.user.userId})
    }

    public async unwarn(warnType: 'выговор' | 'предупреждение') : Some {
        await ModeratorsModule.update(warnType === 'выговор' ? {vigs: this.user.warns-1} : {preds: this.user.preds-1}, {userId: this.user.userId})
    }

    public async points(newPoints: number) : Some {
        await ModeratorsModule.update({points: newPoints}, {userId: this.user.userId})
    }

    public async aban(state: boolean) : Some {
        await ModeratorsModule.update({aban: state}, {userId: this.user.userId})
    }

}