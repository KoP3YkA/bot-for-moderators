import {Rank} from "./Rank";
import {MapAdapter} from "../../../adapters/MapAdapter";
import {RoutingMaps} from "../../../namespaces/RoutingMaps";
import {KeyboardBuilder} from "vk-io";

export class Command {

    // Default
    public static HELP : Command = new Command('help', 'список доступных команд', Rank.DEFAULT)
    public static INFO : Command = new Command('info', 'официальные ресурсы сервера', Rank.DEFAULT)
    public static GET_ID : Command = new Command('getid', 'узнать оригинальный ID пользователя в ВК', Rank.DEFAULT)
    public static STATISTIC : Command = new Command('stats', 'информация о пользователе', Rank.DEFAULT)

    // Jr. Moderator
    public static KICK : Command = new Command('kick', 'исключить пользователя из беседы', Rank.JUNIOR_MODERATOR)
    public static WARN : Command = new Command('warn', 'выдать предупреждение пользователю', Rank.JUNIOR_MODERATOR)
    public static UNWARN : Command = new Command('unwarn', 'снять предупреждение пользователю', Rank.JUNIOR_MODERATOR)
    public static GETBAN : Command = new Command('getban', 'информация о банах пользователя', Rank.JUNIOR_MODERATOR)
    public static GETWARN : Command = new Command('getwarn', 'информация о активных предупреждениях пользователя', Rank.JUNIOR_MODERATOR)
    public static WARNHISTORY : Command = new Command('warnhistory', 'информация о всех предупреждениях пользователя', Rank.JUNIOR_MODERATOR)
    public static STAFF : Command = new Command('staff', 'пользователи с ролями', Rank.JUNIOR_MODERATOR)
    public static SETNICK : Command = new Command('setnick', 'сменить ник у пользователя', Rank.JUNIOR_MODERATOR)
    public static REMOVENICK : Command = new Command('removenick', 'очистить ник у пользователя', Rank.JUNIOR_MODERATOR)
    public static NLIST : Command = new Command('nlist', 'посмотреть ники пользователей', Rank.JUNIOR_MODERATOR)
    public static NONICK : Command = new Command('nonick', 'пользователи без ников', Rank.JUNIOR_MODERATOR)
    public static GETNICK : Command = new Command('getnick', 'проверить ник пользователя', Rank.JUNIOR_MODERATOR)
    public static GETACC : Command = new Command('getacc', 'узнать пользователя по нику', Rank.JUNIOR_MODERATOR)
    public static WARNLIST : Command = new Command('warnlist', 'список пользователей с варном', Rank.JUNIOR_MODERATOR)
    public static CLEAR : Command = new Command('clear', 'очистить сообщения', Rank.JUNIOR_MODERATOR)

    // Sr. Moderator
    public static BAN : Command = new Command('ban', 'заблокировать пользователя в беседе', Rank.SENIOR_MODERATOR)
    public static UNBAN : Command = new Command('unban', 'снять бан в беседе', Rank.SENIOR_MODERATOR)
    public static ADDMODER : Command = new Command('addmoder', 'выдать пользователю модератора', Rank.SENIOR_MODERATOR)
    public static REMOVEROLE : Command = new Command('removerole', 'забрать роль у пользователя', Rank.SENIOR_MODERATOR)
    public static ZOV : Command = new Command('zov', 'упомянуть всех пользователей', Rank.SENIOR_MODERATOR)
    public static BANLIST : Command = new Command('banlist', 'посмотреть заблокированных', Rank.SENIOR_MODERATOR)

    // Jr. Administrator
    public static SKICK : Command = new Command('skick', 'исключить пользователя с бесед сервера', Rank.JUNIOR_ADMINISTRATOR)
    public static QUIET : Command = new Command('quiet', 'Включить выключить режим тишины', Rank.JUNIOR_ADMINISTRATOR)
    public static SBAN : Command = new Command('sban', 'заблокировать пользователя в беседах сервера', Rank.JUNIOR_ADMINISTRATOR)
    public static SUNBAN : Command = new Command('sunban', 'разбанить пользователя в беседах сервера', Rank.JUNIOR_ADMINISTRATOR)
    public static ADDSENMODER : Command = new Command('addsenmoder', 'выдать пользователю старшего модератора', Rank.JUNIOR_ADMINISTRATOR)
    public static TYPE : Command = new Command('type', 'выбрать тип беседы(по умолчанию — основная)', Rank.JUNIOR_ADMINISTRATOR)
    public static SERVER : Command = new Command('server', 'привязать к серверу(установить сетку)', Rank.JUNIOR_ADMINISTRATOR)
    public static GBANLIST : Command = new Command('gbanlist', 'посмотреть список в глобального бана', Rank.JUNIOR_ADMINISTRATOR)
    public static SETTINGS : Command = new Command('settings', 'показать настройки беседы', Rank.JUNIOR_ADMINISTRATOR)
    public static FILTER : Command = new Command('filter', 'включить/выключить фильтр', Rank.JUNIOR_ADMINISTRATOR)

    // Md. Administrator
    public static GBAN : Command = new Command('gban', 'заблокировать пользователя во всех беседах', Rank.MIDDLE_ADMINISTRATOR)
    public static GUNBAN : Command = new Command('gunban', 'разблокировать пользователя во всех беседах', Rank.MIDDLE_ADMINISTRATOR)
    public static SYNC : Command = new Command('sync', 'синхронизация с базой данных(очистка кэша)', Rank.MIDDLE_ADMINISTRATOR)
    public static GREMOVEROLE : Command = new Command('gremoverole', 'забрать у пользователя роли во всех чатах', Rank.MIDDLE_ADMINISTRATOR)
    public static ADDJRADMIN : Command = new Command('addjradmin', 'выдать права младшего администратора', Rank.MIDDLE_ADMINISTRATOR)
    public static URKICK : Command = new Command('urkick', 'кикнуть пользователей без роли', Rank.MIDDLE_ADMINISTRATOR)

    // Chief Administrator
    public static ADDADMIN : Command = new Command('addadmin', 'выдать права администратора', Rank.CHIEF_ADMINISTRATOR)
    public static GZOV : Command = new Command('gzov', 'упомянуть всех пользователей в категории бесед', Rank.CHIEF_ADMINISTRATOR)

    // -------------------------------

    public constructor(
        public name : string,
        public description : string,
        public minimalRank : Rank
    ) {}

    public static findByName(name: string) : Command | null {
        const alias = RoutingMaps.COMMAND_ALIASES.get(name)
        if (alias !== undefined) {
            const map : MapAdapter = new MapAdapter(RoutingMaps.CHAT_COMMANDS);
            const command : string | null = map.getKey<string>(alias);
            if (command) name = command;
        }

        return Object.values(this)
            .filter(obj => obj instanceof Command)
            .find(obj => obj.name == name) ?? null
    }

    public static getCommandsStringByRank(rank: Rank) : string {
        const groupedCommands = Object.values(this)
            .filter(obj => obj instanceof Command && obj.minimalRank.weight <= rank.weight)
            .reduce((acc, cmd) => {
                const rankName = cmd.minimalRank.displayName;
                if (!acc[rankName]) acc[rankName] = [];
                acc[rankName].push(`/${cmd.name} — ${cmd.description}`);
                return acc;
            }, {} as Record<string, string[]>);

        return Object.entries(groupedCommands)
            .map(([rankName, cmds]) => `Команды группы «${rankName.toLowerCase()}»\n${(cmds as unknown as any).join('\n')}`)
            .join('\n\n');
    }

}