import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {BasePrivateButtonExecutor} from "../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {Session} from "../../../core/namespaces/Session";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateButtonRouting('edit_information')
export class EditStatsButton extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        const target : Moderator = new Moderator(message.getField<number>('user'))
        await sender.init();
        await target.init();

        if (sender.userId !== target.userId && sender.rank.weight < ModeratorRank.CURATOR.weight && target.rank instanceof ModeratorRank) {
            return await message.snackbar(`Вы не можете взаимодействовать с другими пользователями`)
        }

        if (sender.rank.weight <= target.rank.weight && sender.userId !== target.userId) {
            return await message.snackbar(`Вы не можете взаимодействовать с этим пользователем!`)
        }

        if (target.rank instanceof PanelModeratorRank && sender.rank !== ModeratorRank.CHIEF && target.userId !== sender.userId) {
            return await message.snackbar(`С модераторами МБИ может взаимодействовать только Главный Модератор!`)
        }

        Session.EDIT_STATS.set(sender.userId, target.userId)

        await message.editMessage({
            message: `Вы вошли в режим изменения статистики.\nЧтобы изменить статистику пользователю, отправьте сообщение в чат, в котором первое слово - статистика, которую вы хотите изменить, а второе слово - новая статистика.\nПример: <<возраст 16>> - изменит возраст на 16 лет.\n\nСписок всей статистики:\n1) форум - изменить форум\n2) дискорд - изменить Discord ID\n3) возраст - изменить возраст\n4) пк - изменить доступ к пк (есть/нет)`
        }, ...[{
            title: 'Отменить',
            color: Color.RED,
            payload: {command: 'cancel'}
        }])

    }

}