import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {User} from "../../../../core/classes/impl/entity/User";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('getwarn')
@WithAlias('чекварн')
export class GetWarn extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        const willSendMessage : NicksMessage = await ButtonMessages.getGetwarn(writtenUser);
        await message.replyWithButtons({
            message: willSendMessage.message
        }, ...willSendMessage.buttons)
    }

}