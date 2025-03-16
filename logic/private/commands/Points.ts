import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateCommand('баллы')
@PrivateCommand('поинты')
@PrivateCommand('point')
@PrivateCommand('points')
@PrivateCommand('поинт')
export class Points extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init()
        if (!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.CURATOR.weight) return;

        if (message.args.length < 3) return await message.reply(`Укажите пользователя и поинты! Добавить поинты = +число, отнять = -число, установить = число`)
        const target : Moderator | null = await message.getIdFromArgument(1)
        if (!target) return await message.reply(`Укажите валидного пользователя!`)
        await target.init();


        if (!await target.isExists()) return await message.reply(`Пользователь не модератор!`)

        if (sender.rank.weight <= target.rank.weight) {
            return await message.reply(`Вы не можете взаимодействовать с этим пользователем!`)
        }

        if (target.rank instanceof PanelModeratorRank && sender.rank !== ModeratorRank.CHIEF) {
            return await message.reply(`С модераторами МБИ может взаимодействовать только Главный Модератор!`)
        }

        const points : number = +message.args[2];
        if (isNaN(points)) return await message.reply(`Укажите поинты числом!`)
        let action : 'отняты' | 'установлены' | 'добавлены' = 'установлены';

        if (points < 0) {
            if (target.points + points < 0) return await message.reply(`У модератора нет столько баллов!`)
            await target.getStatisticService().points(target.points + points)
            action = 'отняты';
        } else if (points === 0) {
            await target.getStatisticService().points(0)
            action = 'установлены'
        } else if (message.args[2][0] === '+') {
            if (points > 9999) return await message.reply(`Нельзя выдать столько поинтов!`)
            if (points + target.points > 100000) return await message.reply(`У модератора слишком много поинтов!`)
            await target.getStatisticService().points(target.points + points)
            action = 'добавлены'
        } else {
            if (points > 100_000) return await message.reply(`Нельзя установить столько баллов!`)
            await target.getStatisticService().points(points)
            action = 'установлены';
        }

        await target.send(`🌀 У вас были ${action} ${points} баллов ${await sender.getMention(NameCase.INS)}!`)
        await message.reply(`У пользователя были ${action} ${points} баллов!`, {title: 'К статистике', color: Color.BLUE, payload: {command: 'statistic', user: target.userId}})
    }

}