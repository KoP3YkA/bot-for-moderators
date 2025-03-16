import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('kick')
@WithAlias('кик')
export class Kick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        let reason : string = "Не указана";
        if (message.args.length > message.nextArg) reason = message.sliceArgs(message.nextArg)

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        const kickMessage =
            await writtenUser.kick() ? `${await sender.getMention(NameCase.NOM)} кикнул-(а) ${await writtenUser.getMention(NameCase.GEN)}\nПричина: ${reason}`
            : `Я не могу кикнуть пользователя в этой беседе, необходимо забрать администратора (звездочку)`
        await message.reply({message: kickMessage})

    }

}