import {Some} from "../../../core/types/Some";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";

@NamedChatButton('nonick')
@MinimalRank(Command.NONICK.minimalRank)
export class NoNickButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Some {
        const willSendMessage : NicksMessage = await ButtonMessages.getNonick(message.chat, 1);
        await message.editMessage({
            message: willSendMessage.message,
        }, ...willSendMessage.buttons)
    }

}