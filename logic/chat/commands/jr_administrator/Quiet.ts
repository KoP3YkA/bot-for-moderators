import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('quiet')
@WithAlias('silence')
@WithAlias('тишина')
export class Quiet extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const chat : Chat = message.chat;
        await chat.init();
        await chat.editQuiet();
        await message.replyWithButtons(await Messages.GET_QUIET_MESSAGE(message.sender, !chat.silence), ...Messages.GET_QUIET_BUTTONS(!chat.silence))
    }

}