import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Rank} from "../../../../core/classes/impl/enums/Rank";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('urkick')
@WithAlias('userrolekick')
@WithAlias('masskick')
@WithAlias('расформ')
export class Urkick extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        const chat : Chat = message.chat;
        const members : Set<Member> = await chat.getMembers();
        for (const i of members) {
            await i.init()
            if (i.rank.weight <= Rank.DEFAULT.weight) await i.kick();
        }
        await message.reply(`${await message.sender.getMention(NameCase.NOM)} кинкнул-(а) пользователей без ролей!`)
    }

}