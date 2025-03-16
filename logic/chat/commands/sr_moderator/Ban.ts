import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('ban')
@WithAlias('бан')
export class Ban extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        if (message.args.length < message.nextArg+1) return await message.reply({
            message: `Укажите причину!`
        })
        const reason : string = message.sliceArgs(message.nextArg)

        if (await writtenUser.getChatBan()) return await message.reply(`Пользователь уже заблокирован!`)

        await writtenUser.kick();
        await writtenUser.punishmentsService().ban(sender.userId, reason)

        await message.replyWithButtons({
            message: `${await sender.getMention(NameCase.NOM)} заблокировал-(а) ${await writtenUser.getMention(NameCase.GEN)}\nПричина: ${reason}`
        }, ...Messages.GET_UNBAN_BUTTON(writtenUser.userId))

    }

}