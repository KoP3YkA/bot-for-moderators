import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('sunban')
@WithAlias('санбан')
export class Sunban extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const writtenUser : Member | null = await message.getIdFromMessageWithArgument(0, false)
        if (!writtenUser) return await message.replySelectUser();
        await writtenUser.init();
        const sender : Member = message.sender;
        await sender.init();

        if (sender.rank.weight <= writtenUser.rank.weight) return await message.replyCannotUseForThisUser();

        const chat : Chat = message.chat;
        await chat.init()
        const gridChats : Chat[] = await chat.getGridChats(true);

        for (const i of gridChats) {
            const member = new Member(writtenUser.userId, i.chatId)
            await member.punishmentsService().unban();
        }

        await message.reply(`${await sender.getMention(NameCase.NOM)} разблокировал-(а) в беседах <<${chat.grid}>> ${await writtenUser.getMention(NameCase.GEN)}`)

    }

}