import {BaseUserService} from "../../base/services/BaseUserService";
import {Member} from "../entity/Member";
import {NameCase} from "../enums/NameCase";

export class StatisticMessage extends BaseUserService {

    public user : Member;

    public constructor(user: Member) {
        super();
        this.user = user;
    }

    public async getStatisticMessage() : Promise<string> {
        return `
Информация о ${await this.user.getMention(NameCase.ABL)}
Дата регистрации: ${await this.user.getVKRegistrationTime().then(time => time.toString)}
Роль: ${this.user.rank.displayName}
Блокировок: ${this.user.bans.length}
Общая блокировка в беседах: ${this.user.globalBan ? 'Есть' : 'Нет'}
Активные предупреждения: ${this.user.warns.length}
Ник: ${this.user.nick ?? 'Нет'}
        `
    }

}