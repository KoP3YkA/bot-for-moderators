import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('addsenmoder')
@WithAlias('senmoder')
export class Addsenmoder extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (writtenUser.rank.weight >= sender.rank.weight) return await message.replyCannotUseForThisUser();
        if (writtenUser.rank.weight >= Rank.SENIOR_MODERATOR.weight) return await message.reply(`У пользователя уже имеется такая роль!`)

        await writtenUser.punishmentsService().setRank(Rank.SENIOR_MODERATOR)

        await message.reply(`
${await sender.getMention(NameCase.NOM)} выдал-(а) права старшего модератора ${await writtenUser.getMention(NameCase.DAT)}        
        `)
    }

}