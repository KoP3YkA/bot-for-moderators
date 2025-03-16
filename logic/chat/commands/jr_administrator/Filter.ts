import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('filter')
export class Filter extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const willSendMessage : NicksMessage = await ButtonMessages.getFilter(message.chat, message.sender);
        await message.replyWithButtons(willSendMessage.message, ...willSendMessage.buttons)
    }

}