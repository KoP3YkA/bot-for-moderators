import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {Session} from "../../../core/namespaces/Session";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";

export class ChangeForumInfo extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init();
        const prizeType : 'приз' | 'товар' = Session.CHANGE_FORUM_STATS.get(sender.userId) as 'приз' | 'товар';
        if (!message.apiEvent.text) return await message.reply(`Укажи информацию!`)
        const head : Moderator[] = await sender.getHead(true);
        for (const i of head) {
            await i.send(`✡️ Модератор ${sender.getOnlyMention(sender.nick)} ${prizeType === 'приз' ? 'выиграл' : 'купил'} изменение информации на форуме в рулетке! Вот его сообщение: ${message.text}`)
        }
        await message.reply(`✅ Ваше сообщение было успешно отправлено отделу администрации! В скором времени указанная вами статистика будет изменена. Вот то, что вы отправили: ${message.text}`)
        Session.CHANGE_FORUM_STATS.delete(sender.userId);
    }

}