import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('warn')
@WithAlias('варн')
@WithAlias('выг')
export class Warn extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
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

        if (writtenUser.warns.length >= 2) {
            await writtenUser.kick();
            await writtenUser.punishmentsService().clearWarns()
        } else {
            await writtenUser.punishmentsService().warn(sender.userId, reason)
        }

        return await message.replyWithButtons({
            message: `${await sender.getMention(NameCase.NOM)} выдал-(а) предупреждение ${await writtenUser.getMention(NameCase.DAT)}\nПричина: ${reason}\nКоличество предупреждений: ${writtenUser.warns.length+1}`
        }, ...Messages.GET_UNWARN_BUTTON(writtenUser.userId))

    }

}