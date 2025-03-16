import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Color} from "../../../../core/classes/impl/enums/Color";
import {User} from "../../../../core/classes/impl/entity/User";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../../core/namespaces/Messages";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('nlist')
@WithAlias('nicklist')
@WithAlias('nicks')
@WithAlias('ники')
export class Nlist extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const willSendMessage : NicksMessage = await ButtonMessages.getNlist(message.chat, 1)
        await message.replyWithButtons(willSendMessage.message, ...willSendMessage.buttons)
    }

}