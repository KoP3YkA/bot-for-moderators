import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {Member} from "../../../core/classes/impl/entity/Member";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@NamedChatButton('unban')
@MinimalRank(Command.BAN.minimalRank)
export class UnbanButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        await writtenUser.init()
        const sender : Member = message.sender;
        await sender.init()
        if (!await writtenUser.getChatBan()) return await message.snackbar(`У пользователя нет бана!`)

        await writtenUser.punishmentsService().unban();

        await message.editMessage({keyboard: null, message: await message.getMessageText()})
        await message.send({
            message: `${await sender.getMention(NameCase.NOM)} разблокировал-(а) ${await writtenUser.getMention(NameCase.GEN)}`
        })

    }

}