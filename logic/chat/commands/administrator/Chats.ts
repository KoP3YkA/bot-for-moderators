import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('chats')
@WithAlias('чаты')
@WithAlias('gchats')
@WithAlias('гчаты')
export class Chats extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const chats : NicksMessage = await ButtonMessages.getChats(1);
        await message.replyWithButtons(chats.message, ...chats.buttons)
    }

}