import {Some} from "../../../core/types/Some";
import {PrivateMessageEvent} from "../../../core/classes/impl/events/PrivateMessageEvent";
import {PayloadButton} from "../../../core/interfaces/buttons/PayloadButton";
import {Color} from "../../../core/classes/impl/enums/Color";
import {Moderator} from "../../../core/classes/impl/entity/Moderator";
import {Session} from "../../../core/namespaces/Session";

export class EditStats {

    public async execute(message: PrivateMessageEvent) : Some {
        const cancelKeyboard : PayloadButton[] = [{
            title: 'Отменить',
            color: Color.RED,
            payload: {command: 'cancel'}
        }]

        if (message.args.length < 2) return await message.reply(`Укажите не менее двух аргументов!`, ...cancelKeyboard)

        const stats : string = message.args[0].toLowerCase()
        const newStats : string = message.args[1].toLowerCase()

        const target : Moderator = new Moderator(Session.EDIT_STATS.get(message.sender.userId) as number)
        if (!await target.isExists()) {
            Session.EDIT_STATS.delete(message.sender.userId)
            await message.reply(`Пользователь уже не модератор!`)
        }

        const keyboard : PayloadButton[] = [{
            title: 'К статистике',
            color: Color.BLUE,
            payload: {command: 'statistic', user: target.userId}
        }]

        switch (stats) {
            case 'форум': {
                if (newStats.length < 40 || newStats.length > 255) return await message.reply(`Укажите валидную длину!`)
                await target.getStatisticService().editForum(newStats)
                Session.EDIT_STATS.delete(message.sender.userId)
                return await message.reply(`Успешно!`, ...keyboard)
            }
            case 'дискорд': {
                if (isNaN(+newStats)) return await message.reply(`Укажите Discord ID числом!`)
                await target.getStatisticService().editDiscord(newStats)
                Session.EDIT_STATS.delete(message.sender.userId)
                return await message.reply(`Успешно!`, ...keyboard)
            }
            case 'возраст': {
                if (isNaN(+newStats)) return await message.reply(`Укажите возраст числом!`)
                if (+newStats < 13 ||+newStats > 100) return await message.reply(`Укажите валидное число!`)
                await target.getStatisticService().editAge(+newStats)
                Session.EDIT_STATS.delete(message.sender.userId)
                return await message.reply(`Успешно!`, ...keyboard)
            }
            case 'пк': {
                if (!['есть', 'нет'].includes(newStats)) return await message.reply('Укажите "есть" или "нет"!')
                await target.getStatisticService().editPC(newStats === 'есть')
                Session.EDIT_STATS.delete(message.sender.userId)
                return await message.reply(`Успешно!`, ...keyboard)
            }
            default: {
                return await message.reply(`Статистики ${stats} не существует! Укажите или "дискорд", или "форум", "пк" или "возраст"`)
            }
        }

    }

}