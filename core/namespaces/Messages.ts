import {Color} from "../classes/impl/enums/Color";
import {PayloadButton} from "../interfaces/buttons/PayloadButton";
import {Member} from "../classes/impl/entity/Member";
import {NameCase} from "../classes/impl/enums/NameCase";
import {Chat} from "../classes/impl/entity/Chat";

export namespace Messages {

    export const INFO_MESSAGE : string = `
Официальные ресурсы сервера:
Сообщество — @belgorod.blackrussia
Дискорд — discord.gg/cEGZUqqwqJ
Заявления в состав модерации Discord — forms.gle/2Ey2EV4MRZuhJCxh8
Создатель бота — @a.vanchugov 
    `

    export const SELECT_USER : string = `
Укажите пользователя!
    `

    export const CANNOT_USE_FOR_THIS_USER : string = `
Вы не можете взаимодействовать с данным пользователем!
    `

    export const GET_NLIST_BUTTONS = (page: number) : PayloadButton[] => {
        return [{
            title: '⏪',
            color: Color.RED,
            payload: {command: 'nlist_minus', page: page}
        }, {
            title: 'Без ников',
            color: Color.BLUE,
            payload: {command: 'nonick', page: page}
        }, {
            title: '⏩',
            color: Color.GREEN,
            payload: {command: 'nlist_plus', page: page}
        }]
    }

    export const GET_NLIST_MESSAGE = (page: number, nicks: string[]) => {
        return `
Пользователи с никами [${page} страница]
${nicks.join('\n')}

Пользователи без ников: <</nonick>>
        `
    }

    export const GET_NONICK_BUTTONS = (page: number) : PayloadButton[] => {
        return [{
            title: '⏪',
            color: Color.RED,
            payload: {command: 'nonick_minus', page: page}
        }, {
            title: 'С никами',
            color: Color.BLUE,
            payload: {command: 'nlist', page: page}
        }, {
            title: '⏩',
            color: Color.GREEN,
            payload: {command: 'nonick_plus', page: page}
        }]
    }

    export const GET_NONICK_MESSAGE = (page: number, nonicks: string[]) => {
        return `
Пользователи без ников [${page} страница]
${nonicks.join('\n')}

Пользователи с никами: <</nlist>>
        `
    }

    export const GET_WARNLIST_BUTTONS = (page: number) : PayloadButton[] => [{
        title: '⏪',
        color: Color.RED,
        payload: {command: 'warnlist_minus', page: page}
    }, {
        title: '⏩',
        color: Color.GREEN,
        payload: {command: 'warnlist_plus', page: page}
    }]

    export const GET_WARNLIST_MESSAGE = (page: number, warns: string[]) : string => {
        return `
Пользователи с предупреждениями [${page} страница]:
${warns.join('\n')}
        `
    }

    export const GET_STATS_BUTTONS = (stats: number) : PayloadButton[] => [{
        title: `Все предупреждения`,
        color: Color.BLUE,
        payload: {command: 'getwarn', user: stats}
    }, {
        title: `Информация о блокировках`,
        color: Color.BLUE,
        payload: {command: 'getban', user: stats}
    }]

    export const GET_GETWARN_BUTTONS = (user: number) : PayloadButton[] => [
        {
            title: 'История предупреждений',
            color: Color.BLUE,
            payload: {command: 'warnhistory', user}
        },
        {
            title: 'Вся информация',
            color: Color.BLUE,
            payload: {command: 'statistic', user}
        }
    ]

    export const GET_WARNHISTORY_BUTTONS = (user: number) : PayloadButton[] => [
        {
            title: 'Активные предупреждения',
            color: Color.BLUE,
            payload: {command: 'getwarn', user}
        },
        {
            title: 'Вся информация',
            color: Color.BLUE,
            payload: {command: 'statistic', user}
        }
    ]

    export const GET_UNWARN_BUTTON = (user: number) : PayloadButton[] => [{
        title: 'Снять варн',
        color: Color.GREEN,
        payload: {command: 'unwarn', user}
    }]

    export const GET_UNBAN_BUTTON = (user: number) : PayloadButton[] => [{
        title: 'Снять бан',
        color: Color.GREEN,
        payload: {command: 'unban', user}
    }]

    export const GET_BANLIST_BUTTONS = (page: number) : PayloadButton[] => [
        {
            title: '⏪',
            color: Color.RED,
            payload: {command: 'banlist_minus', page: page}
        }, {
            title: '⏩',
            color: Color.GREEN,
            payload: {command: 'banlist_plus', page: page}
        }
    ]

    export const GET_BANLIST_MESSAGE = (page: number, bans: string[]) : string => {
        return `
Список банов в беседе [${page} страница]:
${bans.join('\n')}
        `
    }

    export const GET_QUIET_BUTTONS = (mode: boolean) : PayloadButton[] => [
        {
            title: mode ? 'Выключить' : 'Включить',
            color: mode ? Color.RED : Color.GREEN,
            payload: {command: 'quiet'}
        },
        {
            title: 'Все настройки',
            color: Color.BLUE,
            payload: {command: 'settings'}
        }
    ]

    export const GET_QUIET_MESSAGE = async (user: Member, mode: boolean) : Promise<string> => {
        return `
${await user.getMention(NameCase.NOM)}, ${mode ? 'включил' : 'выключил'} режим тишины!
        `
    }

    export const GET_SETTINGS_BUTTONS = (privateMode: boolean) : PayloadButton[] => [
        {
            title: 'Приватный режим',
            color: privateMode ? Color.RED : Color.GREEN,
            payload: {command: 'private'}
        }
    ]

    export const GET_SETTINGS_MESSAGE = async (chat: Chat) : Promise<string> => {
        await chat.init();
        return `
Настройки беседы <<${await chat.getTitle()}>>

Беседы: ${chat.grid}
Тип беседы: ${chat.type}
Тишина: ${chat.silence ? 'Включена' : 'Выключена'}
Фильтер: ${chat.filter ? 'Включен' : 'Выключен'}
Приватная беседа: ${chat.private ? 'Да' : 'Нет'}
ID: ${chat.chatId}
        `
    }

    export const GET_SBAN_BUTTON = (user: number) : PayloadButton[] => [
        {
            title: 'Снять бан',
            color: Color.GREEN,
            payload: {command: 'sunban', user}
        }
    ]

    export const GET_GBANLIST_BUTTONS = (page: number) : PayloadButton[] => [
        {
            title: '⏪',
            color: Color.RED,
            payload: {command: 'gbanlist_minus', page}
        }, {
            title: '⏩',
            color: Color.GREEN,
            payload: {command: 'gbanlist_plus', page}
        }
    ]

    export const GET_GBANLIST_MESSAGE = (page: number, gbans: string[]) : string => {
        return `
Список глобальных блокировок [${page} страница]:
${gbans.join('\n')}
        `
    }

    export const GET_FILTER_BUTTONS = (newMode: boolean) : PayloadButton[] => [
        {
            title: newMode ? 'Выключить' : 'Включить',
            color: newMode ? Color.RED : Color.GREEN,
            payload: {command: 'filter'}
        },
        {
            title: 'Все настройки',
            color: Color.BLUE,
            payload: {command: 'settings'}
        }
    ]

    export const GET_WELCOME_MESSAGE = (nick: string) : string => `${nick}, добро пожаловать в беседу!\n\nНе забудь прочитать закреплённое сообщение!\nПосмотреть ссылки на официальные ресурсы проекта: «/info»`

}