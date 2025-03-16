import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('removerole')
@WithAlias('rrole')
@WithAlias('снятьроль')
export class RemoveRole extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (writtenUser.rank.weight >= sender.rank.weight) return await message.replyCannotUseForThisUser();
        if (writtenUser.rank === Rank.DEFAULT) return await message.reply(`У пользователя нет роли!`)

        await writtenUser.punishmentsService().removeRank()

        await message.reply(`
${await sender.getMention(NameCase.NOM)} забрал-(а) роль у ${await writtenUser.getMention(NameCase.GEN)}        
        `)
    }

}