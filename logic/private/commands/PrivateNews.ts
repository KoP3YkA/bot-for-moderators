import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {ModeratorsModule} from "../../../core/classes/impl/database/modules/ModeratorsModule";

@PrivateCommand('news')
@PrivateCommand('новости')
@PrivateCommand('gzov')
export class PrivateNews extends BaseExecutor {


    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init();
        if (sender.rank !== ModeratorRank.CHIEF) return;
        if (message.args.length < 2) return await message.reply(`Укажите причину вызова!`)
        let moders : 'basic' | 'panel' | 'all' = "all";
        if (['основной', 'панель'].includes(message.args[1]) && message.args.length < 3) return await message.reply(`Укажите причину вызова!`)
        let reason : string = "";
        if (['основной', 'панель'].includes(message.args[1])) {
            moders = message.args[1] === 'основной' ? 'basic' : 'panel';
            reason = message.args.slice(2).join(' ')
        } else {
            reason = message.args.slice(1).join(' ')
        }

        const allModers = await ModeratorsModule.select({});
        let count : number = 0;
        for (const i of allModers) {
            if (moders !== 'all' && i.moderatorType.tag !== moders) continue
            if (i.userId === sender.userId) continue
            const moderator : Moderator = new Moderator(i.userId);
            await moderator.send(`${moderator.getOnlyMention('❗')} Уведомление от Главного Модератора\n\nПричина: ${reason}`).then(() => count++)
        }

        await message.reply(`Успешно отправлено ${count} модераторам!`)

    }

}