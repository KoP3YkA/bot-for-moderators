import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {Some} from "../../../core/types/Some";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateCommand('warn')
@PrivateCommand('выг')
@PrivateCommand('выговор')
export class PrivateWarn extends BaseExecutor {

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

        if (target.warns >= 2) {
            await target.getStatisticService().kick();
            await target.send(`😥 К сожалению, вы были сняты ${await sender.getMention(NameCase.INS)} за 3/3 выговоров. Причина выговора: ${reason}`)
            return await message.reply(`Модератор был снят за 3/3 выговоров.`)
        }

        await target.getStatisticService().warn('выговор')
        await target.send(`❗ Вам был выдан выговор от ${await sender.getMention(NameCase.GEN)} по причине: ${reason}.\nКол-во выговоров: ${target.warns+1}/3`)
        await message.reply(`Выговор был успешно выдан!`, {title: 'К статистике', color: Color.BLUE, payload: {command: 'statistic', user: target.userId}})

    }

}