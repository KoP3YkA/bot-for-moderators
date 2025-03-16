import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {ChatsModule} from "../../../../core/classes/impl/database/modules/ChatsModule";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Time} from "../../../../core/classes/impl/utils/Time";
import {Color} from "../../../../core/classes/impl/enums/Color";

@NamedCommand('gban')
@WithAlias('гбан')
export class Gban extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        if (message.args.length < message.nextArg+1) return await message.reply({
            message: `Укажите причину!`
        })
        const reason : string = message.sliceArgs(message.nextArg)

        if (writtenUser.globalBan) return await message.reply(`У пользователя уже имеется глобальная блокировка!`)
        await writtenUser.punishmentsService().gban(sender.userId, reason);

        await writtenUser.kick();
        await message.replyWithButtons({
            message: `${await sender.getMention(NameCase.NOM)} заблокировал во всех игровых беседах ${writtenUser.getOnlyMention('пользователя-(ю)')}\nПричина: ${reason}`
        }, {
            title: 'Снять бан',
            color: Color.GREEN,
            payload: {command: 'gunban', user: writtenUser.userId}
        })

        const allChats = await ChatsModule.select({})
        const kickMessage = `${await writtenUser.getMention(NameCase.NOM)}, находится в общей блокировке!\n\nИнформация о блокировке:\n${sender.getOnlyMention('Модератор')} | ${reason} | ${Time.currency.toString}`
        for (const i of allChats) {
            if (i.chatId === message.chat.chatId) continue;
            const chat = new Chat(i.chatId);
            const res = await chat.kickMember(writtenUser.userId)
            if (res) await chat.send({message: kickMessage, disable_mentions: true}, {title: 'Разблокировать', color: Color.GREEN, payload: {command: 'gunban', user: writtenUser.userId}})
        }

    }

}