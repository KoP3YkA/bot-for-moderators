import {BaseExecutor} from "../../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../../core/types/Some";
import {PrivateCommand} from "../../../core/annotations/routing/PrivateCommand";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {ModeratorsModule} from "../../../core/classes/impl/database/modules/ModeratorsModule";
import {ModeratorType} from "../../../core/classes/impl/enums/ModeratorType";
import {ModeratorRank} from "../../../core/classes/impl/enums/ModeratorRank";
import {PanelModeratorRank} from "../../../core/classes/impl/enums/PanelModeratorRank";
import {Color} from "../../../core/classes/impl/enums/Color";

@PrivateCommand('newmoderator')
@PrivateCommand('добавитьмодератора')
@PrivateCommand('new')
@PrivateCommand('новыймодератор')
@PrivateCommand('addmoder')
@PrivateCommand('модер')
export class NewModerator extends BaseExecutor {

    public override async execute(message: PrivateMessageEvent): Some {
        const sender : Moderator = message.sender;
        await sender.init();

        if (!(sender.rank instanceof ModeratorRank) || sender.rank.weight < ModeratorRank.CURATOR.weight) return;

        if (message.args.length < 4) return await message.reply(`Вы должны указать ID, ник модератора (одним словом) и состав (панель или основной)!`)

        const target : Moderator | null = await message.getIdFromArgument(1, true)
        if (!target) return await message.reply(`Укажите ID модератора! Это может быть ссылка на его профиль ВК, его короткое имя или сразу VK ID.`)

        if (await target.isExists()) return await message.reply(`Модератор уже зарегистрирован!`)

        const nick : string = message.args[2];
        if (nick.length < 5 || nick.length > 64) return await message.reply(`Длина ника должна быть в пределах разумного!`)
        const results = await ModeratorsModule.select({nickname: nick})
        if (results.length > 0) return await message.reply(`Такой ник уже занят!`)

        const moderType : string = message.args[3];
        if (!['основной', 'панель'].includes(moderType)) return await message.reply(`Укажите валидный состав модерации! Либо "основной" (т.е. модерация дискорд), либо "панель" (т.е. модерация беседы игроков)`)

        await ModeratorsModule.create({
            userId: target.userId,
            moderatorType: moderType === 'основной' ? ModeratorType.BASIC.tag : ModeratorType.PANEL.tag,
            rang: moderType === 'основной' ? ModeratorRank.JUNIOR_MODERATOR.tag : PanelModeratorRank.MIDDLE_MODERATOR.tag,
            nickname: nick,
            firstAppointment: new Date(),
            lastAppointment: new Date(),
            hasPc: true,
            points: 0,
            discord: 'Заполни меня!',
            forum: 'Заполни меня!',
            age: 14,
            preds: 0,
            vigs: 0
        })

        await target.send(`📗 Вы были назначены на должность «Младший Модератор» в ${moderType === 'основной' ? 'основной состав' : 'состав модерации беседы игроков'}! Не забудтье заполнить информацию про себя!`)
        await message.reply('Успешно!', ...[{
            title: 'Посмотреть статистику',
            color: Color.BLUE,
            payload: {command: 'statistic', user: target.userId}
        }])

    }

}