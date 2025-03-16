import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('staff')
@WithAlias('стафф')
export class Staff extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const chat : Chat = message.chat;
        await chat.init();
        const staff : Map<Member, Rank> = chat.staff;

        const juniorModerators : string[] = []
        const seniorModerators : string[] = []
        const juniorAdministrators : string[] = []
        const middleAdministrators : string[] = []
        const chiefAdministrators : string[] = []

        for (const i of staff) {
            if (i[1] === Rank.JUNIOR_MODERATOR) juniorModerators.push(await i[0].getMention(NameCase.NOM))
            else if (i[1] === Rank.SENIOR_MODERATOR) seniorModerators.push(await i[0].getMention(NameCase.NOM))
            else if (i[1] === Rank.JUNIOR_ADMINISTRATOR) juniorAdministrators.push(await i[0].getMention(NameCase.NOM))
        }

        for (const i of (await chat.getManagers())) {
            await i.init()
            if (i.rank === Rank.MIDDLE_ADMINISTRATOR) middleAdministrators.push(await i.getMention(NameCase.NOM))
            if (i.rank === Rank.CHIEF_ADMINISTRATOR) chiefAdministrators.push(await i.getMention(NameCase.NOM))
        }

        if (chiefAdministrators.length < 1) chiefAdministrators.push('Отсутствуют')
        if (middleAdministrators.length < 1) middleAdministrators.push('Отсутствуют')
        if (juniorAdministrators.length < 1) juniorAdministrators.push('Отсутствуют')
        if (seniorModerators.length < 1) seniorModerators.push('Отсутствуют')
        if (juniorModerators.length < 1) juniorModerators.push('Отсутствуют')

        const owner : Member = await chat.getOwner();

        await message.reply(`
Владелец беседы — ${await owner.getMention(NameCase.NOM)}

Главные администраторы:
${chiefAdministrators.join('\n')}

Администраторы:
${middleAdministrators.join('\n')}

Младшие администраторы:
${juniorAdministrators.join('\n')}

Старшие модераторы:
${seniorModerators.join('\n')}

Младшие модераторы:
${juniorModerators.join('\n')}
`)

    }

}