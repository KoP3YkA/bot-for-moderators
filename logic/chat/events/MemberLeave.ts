import {BaseChatEventExecutor} from "../../../core/classes/impl/executors/BaseChatEventExecutor";
import {ChatExecutorEvent} from "../../../core/classes/impl/events/ChatExecutorEvent";
import {Some} from "../../../core/types/Some";
import {ChatEventRouting} from "../../../core/annotations/routing/ChatEventRouting";
import {ChatEvent} from "../../../core/enums/ChatEvent";
import {Member} from "../../../core/classes/impl/entity/Member";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@ChatEventRouting(ChatEvent.MemberLeave)
export class MemberLeave extends BaseChatEventExecutor {

    public override async execute(message: ChatExecutorEvent): Some {
        const target : Member = message.sender;
        const chat : Chat = message.chat;
        await chat.init();
        if (!chat.private) return;

        const res = await target.kick();
        if (res) await message.reply(`${await target.getMention(NameCase.NOM)} вышел-(ла) из беседы и был исключен-(а)`)

    }

}