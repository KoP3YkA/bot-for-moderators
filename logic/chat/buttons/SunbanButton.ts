import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Rank} from "../../../core/classes/impl/enums/Rank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {Member} from "../../../core/classes/impl/entity/Member";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@NamedChatButton('sunban')
@MinimalRank(Command.SUNBAN.minimalRank)
export class SunbanButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const writtenUser : Member = new Member(message.getField<number>('user'), message.chat.chatId)
        console.log(writtenUser)
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.snackbar('Вы не можете взаимодействовать с данным пользователем!')

        const chat : Chat = message.chat;
        await chat.init()
        const gridChats : Chat[] = await chat.getGridChats(true);

        for (const i of gridChats) {
            const member = new Member(writtenUser.userId, i.chatId)
            await member.punishmentsService().unban();
        }

        await message.editMessage({
            message: await message.getMessageText(),
            keyboard: null
        })
        await chat.send({
            message: `${await sender.getMention(NameCase.NOM)} разблокировал-(а) в беседах <<${chat.grid}>> ${await writtenUser.getMention(NameCase.GEN)}`
        })

    }

}