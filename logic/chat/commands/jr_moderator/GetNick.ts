import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('getnick')
@WithAlias('gnick')
@WithAlias('гетник')
@WithAlias('гник')
export class GetNick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();

        await message.reply(writtenUser.nick ?
          `
Ник ${writtenUser.getOnlyMention('пользователя')} — ${writtenUser.nick}
        ` :
          `
У ${writtenUser.getOnlyMention('пользователя')} нет ника!
        `
        )
    }

}