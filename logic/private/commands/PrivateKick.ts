import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";

@PrivateCommand('kick')
@PrivateCommand('снят')
@PrivateCommand('снять')
@PrivateCommand('skick')
@PrivateCommand('gban')
export class PrivateKick extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        const sender : Moderator = message.sender;
        await sender.init();
        if (!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.CURATOR.weight) return;

        if (message.args.length < 3) return await message.reply(`Укажите пользователя и причину!`)
        const target : Moderator | null = await message.getIdFromArgument(1)
        if (!target) return await message.reply(`Укажите валидного пользователя!`)
        const reason : string = message.args.slice(2).join(' ')
        if (reason.length > 500) return await message.reply(`Укажите причину меньше 500 символов!`)

        await target.init();
        const isAdmin : boolean = await target.isAdmin();
        if (!await target.isExists() && !isAdmin) return await message.reply(`Пользователь не является модератором!`)

        if ((!isAdmin && sender.rank.weight >= ModeratorRank.CHIEF.weight) && (sender.rank.weight < ModeratorRank.CURATOR.weight && target.rank instanceof ModeratorRank)) {
            return await message.reply(`Вы не можете взаимодействовать с другими пользователями`)
        }

        if (!isAdmin && (sender.rank.weight <= target.rank.weight)) {
            return await message.reply(`Вы не можете взаимодействовать с этим пользователем!`)
        }

        if (target.rank instanceof PanelModeratorRank && sender.rank !== ModeratorRank.CHIEF) {
            return await message.reply(`С модераторами МБИ может взаимодействовать только Главный Модератор!`)
        }

        await target.getStatisticService().kick()
        await target.send(`😥 К сожалению, вы были сняты с поста ${await sender.getMention(NameCase.INS)}.\nПричина: ${reason}`)
        await message.reply('Пользователь успешно снят!')

    }

}