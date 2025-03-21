import {BasePrivateButtonExecutor} from "../../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../../core/types/Some";
import {ProductRouting} from "../../../../core/annotations/routing/ProductRouting";
import {Moderator} from "../../../../core/classes/impl/entity/Moderator";
import {Session} from "../../../../core/namespaces/Session";
import {Messages} from "../../../../core/namespaces/Messages";

@ProductRouting('fa_stats')
export class FaStatsExecutor extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();
        const head : Moderator[] = await sender.getHead();
        Session.CHANGE_FORUM_STATS.set(sender.userId, 'товар')
        await message.editMessage({message: `✅ Вы купили изменение статистики на форуме! Теперь напишите статистику, которую хотите изменить. Ваше сообщение будет отправлено руководству администрации. НЕ ПРИКРЕПЛЯЙТЕ КАРТИНКИ, используйте хостинги!`}, Messages.TO_STATISTIC(sender.userId))
    }

}