import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('removenick')
@WithAlias('rnick')
@WithAlias('рник')
export class RemoveNick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight < writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        await message.reply(`
${await sender.getMention(NameCase.NOM)} убрал-(а) ник у ${await writtenUser.getMention(NameCase.GEN)}
        `)

        await writtenUser.punishmentsService().setNick(null);
    }

}