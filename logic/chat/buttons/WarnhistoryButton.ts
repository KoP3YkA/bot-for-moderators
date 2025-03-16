import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Rank} from "../../../core/classes/impl/enums/Rank";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {Member} from "../../../core/classes/impl/entity/Member";
import {Messages} from "../../../core/namespaces/Messages";
import {Command} from "../../../core/classes/impl/enums/Command";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";

@NamedChatButton('warnhistory')
@MinimalRank(Command.WARNHISTORY.minimalRank)
export class WarnhistoryButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        const willSendMessage : NicksMessage = await ButtonMessages.getWarnhistory(writtenUser)
        await message.editMessage({
            message: willSendMessage.message
        }, ...willSendMessage.buttons)
    }

}