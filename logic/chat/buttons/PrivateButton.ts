import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {Messages} from "../../../core/namespaces/Messages";

@NamedChatButton('private')
@MinimalRank(Command.SETTINGS.minimalRank)
export class PrivateButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const chat : Chat = message.chat;
        await chat.init();
        await chat.editPrivate()
        await message.editMessage({
            message: await Messages.GET_SETTINGS_MESSAGE(message.chat)
        }, ...Messages.GET_SETTINGS_BUTTONS(chat.private))
    }

}