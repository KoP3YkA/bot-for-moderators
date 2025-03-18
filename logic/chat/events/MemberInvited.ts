import {BaseChatEventExecutor} from "../../../core/classes/impl/executors/BaseChatEventExecutor";
import {ChatEventRouting} from "../../../core/annotations/routing/ChatEventRouting";
import {ChatEvent} from "../../../core/enums/ChatEvent";
import {ChatExecutorEvent} from "../../../core/classes/impl/events/ChatExecutorEvent";
import {Some} from "../../../core/types/Some";
import {Member} from "../../../core/classes/impl/entity/Member";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {Rank} from "../../../core/classes/impl/enums/Rank";
import {ChatsModule} from "../../../core/classes/impl/database/modules/ChatsModule";
import {ChatType} from "../../../core/enums/ChatType";
import {Messages} from "../../../core/namespaces/Messages";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {BanQuery} from "../../../core/classes/impl/database/queries/BanQuery";
import {User} from "../../../core/classes/impl/entity/User";

@ChatEventRouting(ChatEvent.InviteMember)
export class MemberInvited extends BaseChatEventExecutor {

    public override async execute(message: ChatExecutorEvent): Some {
        const initiator : Member = message.sender;
        await initiator.init()
        if (!message.target) return;
        const target : Member = message.target;
        const chat : Chat = message.chat;

        if (target.userId === -229663787) {
            if (await chat.isExists()) return;
            if (initiator.rank.weight < Rank.MIDDLE_ADMINISTRATOR.weight) return await message.reply(`Беседа не может быть зарегистрирована, т.к. бот был приглашен не администратором!`)
            await ChatsModule.create({
                chatId: chat.chatId,
                grid: 'none',
                chatType: ChatType.BASIC
            })
            await message.reply(`Беседа успешно зарегистрирована! \n\nОБЯЗАТЕЛЬНО дайте боту звезду перед использованием!\nПосмотреть настройки -> /settings`)
        } else {
            await chat.init();
            if (chat.private && initiator.rank.weight <= Rank.DEFAULT.weight) return await target.kick();
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
            await message.send(Messages.GET_WELCOME_MESSAGE(await target.getMention(NameCase.NOM)))
        }

    }

}