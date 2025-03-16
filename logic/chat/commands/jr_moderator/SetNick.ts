import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('setnick')
@WithAlias('setnickname')
@WithAlias('сник')
@WithAlias('snick')
export class SetNick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (!(message.args.length > message.nextArg)) return await message.reply('Укажите новый ник!')
        const newNick : string = message.sliceArgs(message.nextArg)

        if (sender.rank.weight < writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        await message.reply(`
${await sender.getMention(NameCase.NOM)} сменил-(а) ник у ${await writtenUser.getMention(NameCase.GEN)}
Новый ник: ${newNick}
        `)

        await writtenUser.punishmentsService().setNick(newNick);

    }

}