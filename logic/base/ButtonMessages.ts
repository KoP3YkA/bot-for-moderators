import {Chat} from "../../core/classes/impl/entity/Chat";
import {Member} from "../../core/classes/impl/entity/Member";
import {User} from "../../core/classes/impl/entity/User";
import {NameCase} from "../../core/classes/impl/enums/NameCase";
import {Messages} from "../../core/namespaces/Messages";
import {PayloadButton} from "../../core/interfaces/buttons/PayloadButton";
import {Some} from "../../core/types/Some";
import {WarnQuery} from "../../core/classes/impl/database/queries/WarnQuery";
import {BanQuery} from "../../core/classes/impl/database/queries/BanQuery";
import {GlobalBansModule} from "../../core/classes/impl/database/modules/GlobalBansModule";
import {GlobalBanQuery} from "../../core/classes/impl/database/queries/GlobalBanQuery";

export interface NicksMessage {
    message: string,
    buttons: PayloadButton[],
    error: boolean
}

export class ButtonMessages {

    public static async getNonick(chat: Chat, page: number) : Promise<NicksMessage> {
        await chat.init();
        const chatNonick : Set<Member> = await chat.getNonickByPage(page);
        const nonick : string[] = [];

        let count : number = (page - 1) * 40;
        for (const i of chatNonick) {
            count++;
            nonick.push(`${count}) ${await new User(i.userId).getMention(NameCase.NOM)}`)
        }

        if (nonick.length < 1) nonick.push('Пользователи без ников отсутствуют.')

        return {
            message: Messages.GET_NONICK_MESSAGE(page, nonick),
            buttons: Messages.GET_NONICK_BUTTONS(page),
            error: chatNonick.size < 1
        }
    }

    public static async getNlist(chat: Chat, page: number) : Promise<NicksMessage> {
        await chat.init();
        const chatNicks : Map<Member, string> = chat.getNicksByPage(page);
        const nicks : string[] = [];

        let count : number = (page - 1) * 40;
        for (const i of chatNicks) {
            count++;
            nicks.push(`${count}) ${await new User(i[0].userId).getMention(NameCase.NOM)} — ${i[1]}`)
        }

        if (nicks.length < 1) nicks.push('Пользователи с никами отсутствуют.')

        return {
            message: Messages.GET_NLIST_MESSAGE(page, nicks),
            buttons: Messages.GET_NLIST_BUTTONS(page),
            error: chatNicks.size < 1
        }
    }

    public static async getWarnlist(chat: Chat, page: number) : Promise<NicksMessage> {
        const warnsMap : Map<Member, number> = await chat.getWarnsByPage(page);
        const warns : string[] = [];

        let count : number = (page - 1) * 40;
        for (const i of warnsMap) {
            count++;
            warns.push(`${count}) ${await new User(i[0].userId).getMention(NameCase.NOM)} — [${i[1]}/3]`)
        }

        if (warns.length < 1) warns.push('Пользователи с варнами отсутствуют!')

        return {
            message: Messages.GET_WARNLIST_MESSAGE(page, warns),
            buttons: Messages.GET_WARNLIST_BUTTONS(page),
            error: warnsMap.size < 1
        }
    }

    public static async getGetban(writtenUser: Member) : Promise<NicksMessage> {
        await writtenUser.init();
        const gban : string =
            writtenUser.globalBan ? `
Информация о общей блокировке в беседах:
${new User(writtenUser.globalBan.moderator).getOnlyMention('Модератор')} | ${writtenUser.globalBan.reason} | ${writtenUser.globalBan.date.toString}
            `
                : 'Блокировка во всех беседах — отсутствует';

        const bans : string[] = new Array<string>();

        if (writtenUser.bans.length < 1) bans.push('блокировки в беседах отсутствуют')
        else {
            bans.push(`Количество бесед, в которых заблокирован пользователь: ${writtenUser.bans.length}`)
            bans.push('Информация о последних 10 банах пользователя:')
            let count : number = 0;
            for (const i of writtenUser.bans) {
                if (count > 9) break
                bans.push(`${count+1}) ${await new Chat(i.chatId).getTitle()} | ${new User(i.moderator).getOnlyMention('Модератор')} | ${i.reason} | ${i.date.toString}`)
                count++;
            }
        }

        return {
            message:
                `
Информация о блокировках ${await writtenUser.getMention(NameCase.GEN)}

${gban}
${bans.join('\n')}
        `,
            buttons: [],
            error: false
        }
    }

    public static async getGetwarn(writtenUser: Member) : Promise<NicksMessage> {
        await writtenUser.init();

        const warns : string[] = new Array<string>();

        if (writtenUser.warns.length < 1) warns.push('Активные предупреждения отсутствуют')
        else {
            warns.push(`Всего предупреждений: ${writtenUser.warns.length}`)
            for (const i of writtenUser.warns) {
                warns.push(`${new User(i.moderator).getOnlyMention('Модератор')} | ${i.reason} | ${i.date.toString}`)
            }
        }

        return {
            message: `
Информация о предупреждениях ${await writtenUser.getMention(NameCase.GEN)}

${warns.join('\n')}
        `, buttons: Messages.GET_GETWARN_BUTTONS(writtenUser.userId),
            error: false
        }
    }

    public static async getWarnhistory(writtenUser: Member) : Promise<NicksMessage> {
        await writtenUser.init();

        const warns : string[] = new Array<string>();
        const history : WarnQuery[] = await writtenUser.getWarnHistory();

        if (history.length < 1) warns.push('История отсутствует')
        else {
            warns.push(`Информация о последних 10 предупреждений пользователя`)
            let count = 0;
            for (const i of history) {
                count++;
                warns.push(`${count}) ${new User(i.moderator).getOnlyMention('Модератор')} | ${i.reason} | ${i.date.toString} — ${i.active ? '✅' : '❌'}`)
            }
        }

        return {
            message: `
История предупреждений ${await writtenUser.getMention(NameCase.GEN)}

${warns.join('\n')}
        `, buttons: Messages.GET_WARNHISTORY_BUTTONS(writtenUser.userId),
            error: false
        }
    }

    public static async getBanlist(chat: Chat, page: number) : Promise<NicksMessage> {
        await chat.init();
        const chatBans : Map<Member, BanQuery> = await chat.getBanListByPage(page);
        const bans : string[] = [];

        let count : number = (page - 1) * 40;
        for (const i of chatBans) {
            count++;
            bans.push(`${count}) ${await i[0].getMention(NameCase.NOM)} | ${i[1].reason} | ${new User(i[1].moderator).getOnlyMention('Модератор')} | ${i[1].date.toString}`)
        }

        if (bans.length < 1) bans.push('Баны отсутствуют!')

        return {
            message: Messages.GET_BANLIST_MESSAGE(page, bans),
            buttons: Messages.GET_BANLIST_BUTTONS(page),
            error: chatBans.size < 1
        }

    }

    public static async getGbanlist(page: number) : Promise<NicksMessage> {
        const allGbans : GlobalBanQuery[] = await GlobalBansModule.select({}, {order: 'id', limit: 40, offset: (page - 1) * 40});
        const gbans : string[] = [];
        let count : number = (page - 1) * 40;
        for (const i of allGbans) {
            count++;
            gbans.push(`${count}) ${await new User(i.userId).getMention(NameCase.NOM)} | ${i.reason} | ${new User(i.moderator).getOnlyMention('Модератор')} | ${i.date.toString}`)
        }
        if (gbans.length < 1) gbans.push('Глобальных банов нет!')
        return {
            message: Messages.GET_GBANLIST_MESSAGE(page, gbans),
            buttons: Messages.GET_GBANLIST_BUTTONS(page),
            error: allGbans.length < 1
        }
    }

    public static async getFilter(chat: Chat, sender: Member) : Promise<NicksMessage> {
        await chat.init();
        await chat.editFilter();
        await sender.init();
        return {
            message: `${await sender.getMention(NameCase.NOM)}, ${!chat.filter ? 'включил' : 'выключил'} фильтер!`,
            buttons: Messages.GET_FILTER_BUTTONS(!chat.filter),
            error: false
        }
    }

}