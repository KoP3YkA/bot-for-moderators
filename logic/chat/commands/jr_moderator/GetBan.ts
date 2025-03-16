import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Some} from "../../../../core/types/Some";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {User} from "../../../../core/classes/impl/entity/User";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {ButtonMessages, NicksMessage} from "../../../base/ButtonMessages";

@NamedCommand('getban')
@WithAlias('чекбан')
@WithAlias('гетбан')
export class GetBan extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();

        const willSendMessage : NicksMessage = await ButtonMessages.getGetban(writtenUser)

        await message.reply(willSendMessage.message)
    }

}