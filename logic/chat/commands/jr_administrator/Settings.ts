import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('settings')
@WithAlias('настройки')
export class Settings extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const chat : Chat = message.chat;
        await chat.init();
        await message.replyWithButtons(await Messages.GET_SETTINGS_MESSAGE(message.chat), ...Messages.GET_SETTINGS_BUTTONS(chat.private))
    }

}