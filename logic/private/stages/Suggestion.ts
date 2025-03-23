import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {Session} from "../../../core/namespaces/Session";
import {Messages} from "../../../core/namespaces/Messages";

export class Suggestion extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init();

        if (message.text.trim() === "") return await message.reply(`Укажите текст!`)
        for (const i of await message.sender.getHead()) {
            await i.send(`✴️ Предложение по улучшению от ${sender.getOnlyMention(sender.nick)}.\n\n💞 ${message.text}`)
        }
        await message.reply(`✅ Ваше предложение было отправлено Главному Модератору! Вот его текст: ${message.text}`, Messages.TO_STATISTIC(sender.userId))
        Session.SUGGESTIONS.delete(sender.userId);
    }

}