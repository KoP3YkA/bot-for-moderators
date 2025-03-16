import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('skick')
export class Skick extends BaseCommandExecutor {

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
        const gridChats : Chat[] = await chat.getGridChats();

        const senderNick : string = await sender.getMention(NameCase.NOM)
        const userNick : string = await writtenUser.getMention(NameCase.GEN)
        const willSendMessage = `${senderNick} исключил-(а) в беседах <<${chat.grid}>> ${userNick}\nПричина: ${reason}`
        let messageInChat : boolean = false;

        for (const i of gridChats) {
            const selectedChat : Chat = i;
            const res = await selectedChat.kickMember(writtenUser.userId);
            if (res) await selectedChat.send({message: willSendMessage, disable_mentions: true})
            if (res && selectedChat.chatId === chat.chatId) messageInChat = true;
        }

        if (!messageInChat) await message.send(willSendMessage)

    }

}