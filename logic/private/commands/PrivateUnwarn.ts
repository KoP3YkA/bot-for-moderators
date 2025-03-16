import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateCommand('unwarn')
@PrivateCommand('unvig')
@PrivateCommand('анварн')
@PrivateCommand('анвыг')
@PrivateCommand('унвыг')
@PrivateCommand('унварн')
export class PrivateUnwarn extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init()
        if (!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.CURATOR.weight) return;

        if (message.args.length < 3) return await message.reply(`Укажите пользователя и тип наказания!`)
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

        const warnType : string = message.args[2].toLowerCase();
        if (!['выговор', 'предупреждение'].includes(warnType)) return await message.reply(`Укажите валидный тип выговора! Либо "выговор", либо "предупреждение"!`)

        const warns : number = warnType === 'выговор' ? target.warns : target.preds;
        if (warns <= 0) return await message.reply(`У пользователя нету данного вида наказания!`)

        await target.getStatisticService().unwarn(warnType as 'выговор' | 'предупреждение')
        await target.send(`🈯 Вам ${warnType === 'выговор' ? 'был снят один выговор' : 'было снято одно предупреждение'} ${await sender.getMention(NameCase.INS)}! Количество ${warnType === 'выговор' ? 'выговоров' : 'предупреждений'}: ${warns-1}`)
        await message.reply(`Успешно!`, {title: 'К статистике', color: Color.BLUE, payload: {command: 'statistic', user: target.userId}})
    }

}