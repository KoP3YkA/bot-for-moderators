import {BasePrivateButtonExecutor} from "../../../core/classes/impl/executors/BasePrivateButtonExecutor";
import {PrivateButtonEvent} from "../../../core/classes/impl/events/PrivateButtonEvent";
import {Some} from "../../../core/types/Some";
import {PrivateButtonRouting} from "../../../core/annotations/routing/PrivateButtonRouting";
import {OnlyBasicStaff} from "../../../core/annotations/routing/OnlyBasicStaff";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@PrivateButtonRouting('kick')
@OnlyBasicStaff(ModeratorRank.CURATOR)
export class PrivateKickButton extends BasePrivateButtonExecutor {

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

        if (target.rank instanceof PanelModeratorRank && sender.rank !== ModeratorRank.CHIEF) {
            return await message.snackbar(`С модераторами МБИ может взаимодействовать только Главный Модератор!`)
        }

        await target.getStatisticService().kick()
        await target.send(`😥 К сожалению, вы были сняты с поста ${await sender.getMention(NameCase.INS)}. Причина не указана.`)
        await message.editMessage({
            message: 'Пользователь успешно снят!'
        })

    }

}