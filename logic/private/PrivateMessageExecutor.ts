import {Nothing} from "../../core/types/Nothing";
import {PrivateMessageEvent} from "../../core/classes/impl/events/PrivateMessageEvent";
import {BaseExecutor} from "../../core/classes/base/executors/BaseExecutor";
import {Moderator} from "../../core/classes/impl/entity/Moderator";
import {PayloadButton} from "../../core/interfaces/buttons/PayloadButton";
import {Color} from "../../core/classes/impl/enums/Color";
import {ModeratorRank} from "../../core/classes/impl/enums/ModeratorRank";
import {Session} from "../../core/namespaces/Session";
import {EditStats} from "./stages/EditStats";
import {RoutingMaps} from "../../core/namespaces/RoutingMaps";
import {Messages} from "../../core/namespaces/Messages";
import {AdminMessageExecutor} from "./AdminMessageExecutor";
import {ChangeForumInfo} from "./stages/ChangeForumInfo";
import {System} from "../../core/namespaces/System";

export class PrivateMessageExecutor extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Nothing {
        const sender : Moderator = message.sender;
        if (await sender.isAdmin()) {
            return await new AdminMessageExecutor().execute(message);
        }
        if (!await sender.isExists()) return await message.reply(`Я тебя не знаю! Если ты являешься модератором, то напиши своему главному модератору, он добавит тебя в мою базу данных!`)

        if (Session.EDIT_STATS.has(sender.userId)) {
            return await new EditStats().execute(message)
        }
        if (Session.CHANGE_FORUM_STATS.has(sender.userId)) {
            return await new ChangeForumInfo().execute(message)
        }

        let command : string = message.args[0];
        if (System.COMMAND_PREFIXES.includes(command[0])) command.slice(1)
        if (message.args.length > 0 && RoutingMaps.PRIVATE_COMMANDS.has(command)) {
            const executor = RoutingMaps.PRIVATE_COMMANDS.get(command) as Function;
            const _class = new (executor as { new(): BaseExecutor })()
            return await _class.execute(message);
        }

        await sender.init();
        const keyboard : PayloadButton[] = [{
            title: 'Изменение информации',
            color: Color.BLUE,
            payload: {command: 'edit_information', user: sender.userId}
        }, Messages.MAGAZINE_BUTTON]

        if (sender.rank instanceof ModeratorRank && sender.rank.weight >= ModeratorRank.CURATOR.weight) keyboard.push({
            title: 'Модераторы',
            color: Color.WHITE,
            payload: {command: 'moderators'},
            newRow: true
        })

        await message.reply(`Ваша статистика\n${sender.getStatisticService().getStatisticMessage()}`, ...keyboard)
    }

}