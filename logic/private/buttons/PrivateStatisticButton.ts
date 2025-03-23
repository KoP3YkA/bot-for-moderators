import {BasePrivateButtonExecutor} from "../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PayloadButton} from "../../../core/interfaces/buttons/PayloadButton";
import {Color} from "../../../core/classes/impl/enums/Color";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {Messages} from "../../../core/namespaces/Messages";

@PrivateButtonRouting('statistic')
export class PrivateStatisticButton extends BasePrivateButtonExecutor {

    public override async execute(message: PrivateButtonEvent): Some {
        const sender : Moderator = message.sender;
        const target : Moderator = new Moderator(message.getField<number>('user'));
        await sender.init();
        const isAdmin = await sender.isAdmin();

        if (sender.userId !== target.userId && !isAdmin) {
            if (sender.rank.weight < ModeratorRank.CURATOR.weight) return await message.reply(`Вы не можете просматривать чужую статистику!`)
        }

        await target.init();
        if (sender.rank.weight <= target.rank.weight && target.rank instanceof ModeratorRank && sender.userId !== target.userId && !isAdmin) {
            return await message.snackbar('Вы не можете просматривать статистику данного пользователя!')
        }

        if (target.rank instanceof PanelModeratorRank && sender.rank !== ModeratorRank.CHIEF && !isAdmin) {
            return await message.snackbar(`С модераторами МБИ может взаимодействовать только Главный Модератор!`)
        }

        const keyboard : PayloadButton[] = [{
            title: 'Изменение информации',
            color: Color.BLUE,
            payload: {command: 'edit_information', user: target.userId}
        }]

        if (sender.userId === target.userId) keyboard.push(Messages.MAGAZINE_BUTTON)

        if (sender.rank instanceof ModeratorRank && sender.rank.weight >= ModeratorRank.CURATOR.weight) keyboard.push({
            title: 'Модераторы',
            color: Color.WHITE,
            payload: {command: 'moderators'},
            newRow: sender.userId === target.userId
        })

        await message.editMessage({
            message: `${sender.userId === target.userId ? 'Ваша статистика' : 'Статистика пользователя'}\n${target.getStatisticService().getStatisticMessage()}`
        }, ...keyboard)

    }

}