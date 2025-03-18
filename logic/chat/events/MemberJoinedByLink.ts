import {BaseChatEventExecutor} from "../../../core/classes/impl/executors/BaseChatEventExecutor";
import {ChatExecutorEvent} from "../../../core/classes/impl/events/ChatExecutorEvent";
import {Some} from "../../../core/types/Some";
import {ChatEventRouting} from "../../../core/annotations/routing/ChatEventRouting";
import {ChatEvent} from "../../../core/enums/ChatEvent";
import {Member} from "../../../core/classes/impl/entity/Member";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../core/namespaces/Messages";
import {BanQuery} from "../../../core/classes/impl/database/queries/BanQuery";
import {Time} from "../../../core/classes/impl/utils/Time";
import {User} from "../../../core/classes/impl/entity/User";

@ChatEventRouting(ChatEvent.MemberJoinedByLink)
export class MemberJoinedByLink extends BaseChatEventExecutor {

    public override async execute(message: ChatExecutorEvent): Some {
        const target : Member = message.sender;
        const chat : Chat = message.chat;
        await chat.init();

        if (chat.private) return await target.kick();
        const ban : BanQuery | null = await target.getChatBan();
        if (ban) {
            await target.kick();
            await message.reply(`${await target.getMention(NameCase.NOM)}, находится в блокировке!\n\nИнформация о блокировке:\n${new User(ban.moderator).getOnlyMention('Модератор')} | ${ban.reason} | ${ban.date.toString}`)
        }
        await target.init();
        if (target.globalBan) {
            await target.kick();
            await message.reply(`${await target.getMention(NameCase.NOM)}, находится в глобальной блокировке!\n\nИнформация о блокировке:\n${new User(target.globalBan.moderator).getOnlyMention('Модератор')} | ${target.globalBan.reason} | ${target.globalBan.date.toString}`)
        }

        await message.reply(Messages.GET_WELCOME_MESSAGE(await target.getMention(NameCase.NOM)))

    }

}