import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {Command} from "../../../core/classes/impl/enums/Command";
import {Member} from "../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@NamedChatButton('unwarn')
@MinimalRank(Command.UNWARN.minimalRank)
export class UnwarnButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        await writtenUser.init()
        const sender : Member = message.sender;
        await sender.init()
        if (sender.rank.weight <= writtenUser.rank.weight) return await message.snackbar(`Вы не можете снять варн этому пользователю!`);
        if (writtenUser.warns.length <= 0) return await message.snackbar(`У пользователя нет активных предупреждений!`)

        await writtenUser.punishmentsService().unwarn();

        await message.editMessage({keyboard: null, message: await message.getMessageText()})
        await message.send({
            message: `${await sender.getMention(NameCase.NOM)} снял-(а) предупреждение ${await writtenUser.getMention(NameCase.DAT)}\nКоличество предупреждений: ${writtenUser.warns.length-1}`
        })

    }

}