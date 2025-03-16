import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {Member} from "../../../core/classes/impl/entity/Member";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";

@NamedChatButton('getban')
@MinimalRank(Command.GETBAN.minimalRank)
export class GetBanButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        const willSendMessage : NicksMessage = await ButtonMessages.getGetban(writtenUser)
        await message.editMessage({
            message: willSendMessage.message
        })
    }

}