import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('sban')
@WithAlias('сбан')
export class Sban extends BaseCommandExecutor {

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

        const chat : Chat = message.chat;
        await chat.init()
        const gridChats : Chat[] = await chat.getGridChats(true);

        const senderNick : string = await sender.getMention(NameCase.NOM)
        const userNick : string = await writtenUser.getMention(NameCase.GEN)
        const willSendMessage = `${senderNick} заблокировал-(а) в беседах <<${chat.grid}>> ${userNick}\nПричина: ${reason}`
        let messageInChat : boolean = false;

        for (const i of gridChats) {
            const member = new Member(writtenUser.userId, i.chatId)
            await member.init();
            if (await member.getChatBan()) continue;
            await member.punishmentsService().ban(sender.userId, reason)
            const res : boolean = await member.kick()
            if (res) await i.send({
                message: willSendMessage
            }, ...Messages.GET_SBAN_BUTTON(writtenUser.userId))
            if (res && i.chatId === chat.chatId) messageInChat = true
        }


        if (!messageInChat) await message.sendWithButtons(willSendMessage, ...Messages.GET_SBAN_BUTTON(writtenUser.userId))
    }

}