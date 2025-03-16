import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Color} from "../../../core/classes/impl/enums/Color";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";

@PrivateCommand('предупреждение')
@PrivateCommand('пред')
export class Pred extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init()
        if (!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.CURATOR.weight) return;

        if (message.args.length < 3) return await message.reply(`Укажите пользователя и причину!`)
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

        const reason : string = message.args.slice(2).join(' ')
        if (reason.length > 255) return await message.reply(`Укажите причину до 255 символов!`)

        if (target.preds >= 1) {
            await target.getStatisticService().unwarn('предупреждение');
            if (target.warns >= 2) {
                await target.getStatisticService().kick()
                await target.send(`😥 К сожалению, вы были сняты ${await sender.getMention(NameCase.INS)} за 3/3 выговоров (было выдано второе прудупреждение при 2/3 выговоров). Причина предупреждения: ${reason}`)
                return await message.reply(`Модератор был снят за 3/3 выговоров (2/2 предупреждений при 2/3 выговоров).`)
            }
            await target.getStatisticService().warn('выговор')
            await target.send(`❗ Вам было выдано предупреждение ${await sender.getMention(NameCase.INS)}, которое перешло в выговор. Кол-во выговоров: ${target.warns+1}. Причина предупреждения: ${reason}`)
            return await message.reply(`Выговор за 2/2 предупреждений был выдан!`, {title: 'К статистике', color: Color.BLUE, payload: {command: 'statistic', user: target.userId}})
        }

        await target.getStatisticService().warn('предупреждение')
        await target.send(`❗ Вам было выдано предупреждение от ${await sender.getMention(NameCase.GEN)} по причине: ${reason}.\nКол-во предупреждений: ${target.preds+1}/2`)
        await message.reply(`Предупреждение было успешно выдано!`, {title: 'К статистике', color: Color.BLUE, payload: {command: 'statistic', user: target.userId}})
    }

}