import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@PrivateCommand('aban')
@PrivateCommand('абан')
@PrivateCommand('adminban')
@PrivateCommand('админбан')
@PrivateCommand('заморозка')
export class AdminBan extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init();

        if (sender.rank instanceof PanelModeratorRank || sender.rank.weight < ModeratorRank.CURATOR.weight) return;
        if (message.args.length < 3) return await message.reply(`Укажите действие и пользователя!`);

        const action : string = message.args[1];
        const map : Map<string, 'add' | 'remove'> = new Map([
            ['add', 'add'],
            ['выдать', 'add'],
            ['give', 'add'],
            ['дать', 'add'],
            ['set', 'add'],
            ['+', 'add'],

            ['remove', 'remove'],
            ['забрать', 'remove'],
            ['take', 'remove'],
            ['убрать', 'remove'],
            ['del', 'remove'],
            ['-', 'remove']
        ])
        if (!map.has(action)) return await message.reply(`Укажите либо "выдать", либо "забрать"!`)
        const abanAction : 'remove' | 'add' = map.get(action) as 'remove' | 'add';

        const target : Moderator | null = await message.getIdFromArgument(2);
        if (!target) return await message.reply(`Укажите валидного модератора!`)

        if (!await target.isExists()) return await message.reply(`Пользователь не модератор!`)
        if (target.rank instanceof PanelModeratorRank && sender.rank.weight < ModeratorRank.CHIEF.weight) return await message.reply(`С модераторами МБИ может взаимодействовать только Главный Модератор!`);
        if (target.rank instanceof ModeratorRank && target.rank.weight >= sender.rank.weight) return await message.reply(`Вы не можете взаимодействовать с данным пользователем!`)

        if (abanAction === 'remove' && !target.aban) return await message.reply(`У пользователя нет админ-бана!`)
        if (abanAction === 'add' && target.aban) return await message.reply(`У пользователя уже есть абан!`)

        await target.getStatisticService().aban(abanAction === 'add');
        await target.send(`${abanAction === 'add' ? '❄️' : '🔥'} ${await sender.getMention(NameCase.NOM)} ${abanAction === 'add' ? 'временно заморозил' : 'разморозил'} ваши права.${abanAction === 'add' ? ' В течение этого времени Вы не можете использовать бота.' : ''}`)
        await message.reply(`Успешно!`)

    }

}