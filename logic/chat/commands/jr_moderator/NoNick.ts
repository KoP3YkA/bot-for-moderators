import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import { Some } from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {User} from "../../../../core/classes/impl/entity/User";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../../core/namespaces/Messages";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('nonick')
@WithAlias('безников')
export class NoNick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const willSendMessage : NicksMessage = await ButtonMessages.getNonick(message.chat, 1);
        await message.replyWithButtons(willSendMessage.message, ...willSendMessage.buttons)
    }

}