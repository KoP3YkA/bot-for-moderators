import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {Member} from "../../../core/classes/impl/entity/Member";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";

@NamedChatButton('getwarn')
@MinimalRank(Command.GETWARN.minimalRank)
export class GetWarnButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        const willSendMessage : NicksMessage = await ButtonMessages.getGetwarn(writtenUser)
        await message.editMessage({
            message: willSendMessage.message
        }, ...willSendMessage.buttons)
    }

}