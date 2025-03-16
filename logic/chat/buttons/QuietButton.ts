import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {Messages} from "../../../core/namespaces/Messages";

@NamedChatButton('quiet')
@MinimalRank(Command.QUIET.minimalRank)
export class QuietButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const chat : Chat = message.chat;
        await chat.init();
        await chat.editQuiet();
        await message.editMessage({
            message: await Messages.GET_QUIET_MESSAGE(message.sender, !chat.silence)
        }, ...Messages.GET_QUIET_BUTTONS(!chat.silence))
    }

}