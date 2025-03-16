import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";

@NamedChatButton('filter')
@MinimalRank(Command.FILTER.minimalRank)
export class FilterButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const willSendMessage : NicksMessage = await ButtonMessages.getFilter(message.chat, message.sender);
        await message.editMessage({
            message: willSendMessage.message
        }, ...willSendMessage.buttons)
    }

}