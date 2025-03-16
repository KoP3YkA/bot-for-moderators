import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorType} from "../../../core/classes/impl/enums/ModeratorType";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateCommand('setrank')
@PrivateCommand('сетранг')
@PrivateCommand('повысить')
@PrivateCommand('понизить')
export class PrivateSetRank extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init()
        if (!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.DEPUTY.weight) return;

        if (message.args.length < 3) return await message.reply(`Укажите пользователя и причину!`)
        const target : Moderator | null = await message.getIdFromArgument(1)
        if (!target) return await message.reply(`Укажите валидного пользователя!`)
        const newRank : string = message.args[2]
        await target.init();
        let selectedRank : ModeratorRank | PanelModeratorRank;

        if (!await target.isExists()) return await message.reply(`Пользователь не модератор!`)

        if (target.moderatorType === ModeratorType.BASIC) {
            const map : Map<string, ModeratorRank> = new Map([
                ['згм', ModeratorRank.DEPUTY],
                ['км', ModeratorRank.CURATOR],
                ['см', ModeratorRank.SENIOR_MODERATOR],
                ['м', ModeratorRank.MIDDLE_MODERATOR],
                ['мм', ModeratorRank.JUNIOR_MODERATOR]
            ])
            if (!map.has(newRank.toLowerCase())) return await message.reply(`Укажите должность в основном составе! Например: "згм", "км", "см", "м", "мм"`)
            selectedRank = map.get(newRank.toLowerCase()) as ModeratorRank;
            if (selectedRank.weight >= sender.rank.weight) return await message.reply('Вы не можете выдать такую должность!')
        } else {
            const map : Map<string, PanelModeratorRank> = new Map([
                ['см', PanelModeratorRank.SENIOR_MODERATOR],
                ['м', PanelModeratorRank.MIDDLE_MODERATOR],
            ])
            if (!map.has(newRank.toLowerCase())) return await message.reply(`Укажите должность в составе МБИ! Например: "см", "м"`)
            selectedRank = map.get(newRank.toLowerCase()) as PanelModeratorRank;
        }

        if (selectedRank.weight >= sender.rank.weight) return await message.reply(`Вы не можете выдать такой ранг!`)

        if (sender.rank.weight <= target.rank.weight) {
            return await message.reply(`Вы не можете взаимодействовать с этим пользователем!`)
        }

        if (target.rank instanceof PanelModeratorRank && sender.rank !== ModeratorRank.CHIEF) {
            return await message.reply(`С модераторами МБИ может взаимодействовать только Главный Модератор!`)
        }

        await target.getStatisticService().setRank(selectedRank.tag)
        await target.send(`🌈 Вам был выдан ранг «${selectedRank.displayName}» ${await sender.getMention(NameCase.INS)}!`)
        await message.reply(`Успешно!`, {
            title: 'К статистике',
            color: Color.BLUE,
            payload: {command: 'statistic', user: target.userId}
        })
    }

}