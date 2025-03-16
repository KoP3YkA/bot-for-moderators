import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {User} from "../../../../core/classes/impl/entity/User";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {WarnQuery} from "../../../../core/classes/impl/database/queries/WarnQuery";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('warnhistory')
@WithAlias('whistory')
@WithAlias('history')
@WithAlias('историяварнов')
export class WarnHistory extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        const willSendMessage : NicksMessage = await ButtonMessages.getWarnhistory(writtenUser)
        await message.replyWithButtons(willSendMessage.message, ...willSendMessage.buttons)
    }

}