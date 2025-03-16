import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Main} from "../../../../Main";

@NamedCommand('clear')
@WithAlias('чистка')
@WithAlias('очистить')
@WithAlias('клир')
export class Clear extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const replyMessage = message.apiEvent.replyMessage;
        const forwards = message.apiEvent.forwards;
        const sender = message.sender;
        await sender.init();
        const willSendMessage : string = `${await sender.getMention(NameCase.NOM)}, очистил сообщение-(я)!`
        if (replyMessage) {
            await Main.getApi().deleteMessage(message.chat.chatId, replyMessage.conversationMessageId as number)
            await message.reply(willSendMessage)
        } else if (forwards.length > 0) {
            for (const i of forwards) {
                await Main.getApi().deleteMessage(message.chat.chatId, i.conversationMessageId as number)
            }
            await message.reply(willSendMessage)
        } else {
            await message.reply('Укажите сообщение!')
        }
    }

}