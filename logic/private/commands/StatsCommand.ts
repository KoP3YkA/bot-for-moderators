import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {ModeratorType} from "../../../core/classes/impl/enums/ModeratorType";
import {Color} from "../../../core/classes/impl/enums/Color";
import {AdminCommand} from "../../../core/annotations/routing/AdminCommand";

@PrivateCommand('stats')
@PrivateCommand('статистика')
@PrivateCommand('стата')
export class StatsCommand extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init();
        const isAdmin : boolean = await sender.isAdmin();

        if ((!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.CURATOR.weight) && !isAdmin) return;

        if (message.args.length < 2) return await message.reply(`Укажите пользователя!`)
        const target : Moderator | null = await message.getIdFromArgument(1);
        if (!target) return await message.reply(`Указан невалидный пользователь!`)

        if (!await target.isExists()) return await message.reply(`Этого пользователя не существует!`)
        await target.init();

        if (!isAdmin && (target.rank instanceof ModeratorRank && target.rank.weight >= sender.rank.weight)) return await message.reply(`Вы не можете взаимодействовать с данным пользователем!`)
        if (!isAdmin && (target.moderatorType === ModeratorType.PANEL && sender.rank !== ModeratorRank.CHIEF)) return await message.reply(`С другим составом может взаимодействовать только главный модератор!`)

        await message.reply(`Статистика пользователя:\n${target.getStatisticService().getStatisticMessage()}`, ...[
            {
                title: 'Изменение информации',
                color: Color.BLUE,
                payload: {command: 'edit_information', user: target.userId}
            },
            {
                title: 'Снять, не указывая причину',
                color: Color.RED,
                payload: {command: 'kick', user: target.userId}
            }
        ])

    }

}