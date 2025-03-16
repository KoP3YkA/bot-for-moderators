import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('unwarn')
@WithAlias('анварн')
@WithAlias('снятьварн')
export class Unwarn extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();
        if (writtenUser.warns.length <= 0) return await message.reply(`У пользователя нет активных предупреждений!`)

        await writtenUser.punishmentsService().unwarn();

        await message.reply(`${await sender.getMention(NameCase.NOM)} снял-(а) предупреждение ${await writtenUser.getMention(NameCase.DAT)}\nКоличество предупреждений: ${writtenUser.warns.length-1}`)

    }

}