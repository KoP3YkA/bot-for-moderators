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

export class PrivateMessageExecutor extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Nothing {
        const sender : Moderator = message.sender;
        if (!await sender.isExists()) return await message.reply(`Я тебя не знаю! Если ты являешься модератором, то напиши своему главному модератору, он добавит тебя в мою базу данных!`)

        if (Session.EDIT_STATS.has(sender.userId)) {
            return await new EditStats().execute(message)
        }

        if (message.args.length > 0 && RoutingMaps.PRIVATE_COMMANDS.has(message.args[0])) {
            const executor = RoutingMaps.PRIVATE_COMMANDS.get(message.args[0]) as Function;
            const _class = new (executor as { new(): BaseExecutor })()
            return await _class.execute(message);
        }

        await sender.init();
        const keyboard : PayloadButton[] = [{
            title: 'Изменение информации',
            color: Color.BLUE,
            payload: {command: 'edit_information', user: sender.userId}
        }]

        if (sender.rank instanceof ModeratorRank && sender.rank.weight >= ModeratorRank.CURATOR.weight) keyboard.push({
            title: 'Модераторы',
            color: Color.WHITE,
            payload: {command: 'moderators'}
        })

        await message.reply(`Ваша статистика\n${sender.getStatisticService().getStatisticMessage()}`, ...keyboard)
    }

}