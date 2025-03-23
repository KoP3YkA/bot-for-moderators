import {BaseExecutor} from "../../core/classes/base/executors/BaseExecutor";
import {PrivateMessageEvent} from "../../core/classes/impl/events/PrivateMessageEvent";
import {Some} from "../../core/types/Some";
import {Administrator} from "../../core/classes/impl/entity/Administrator";
import {RoutingMaps} from "../../core/namespaces/RoutingMaps";
import {Messages} from "../../core/namespaces/Messages";
import {System} from "../../core/namespaces/System";

export class AdminMessageExecutor extends BaseExecutor {

    public async execute(message: PrivateMessageEvent) : Some {
        let command : string = message.args[0];
        if (System.COMMAND_PREFIXES.includes(command[0])) command.slice(1)

        if (message.args.length > 0 && RoutingMaps.PRIVATE_COMMANDS.has(command)) {
            const executor = RoutingMaps.PRIVATE_COMMANDS.get(command) as Function;
            const _class = new (executor as { new(): BaseExecutor })()
            return await _class.execute(message);
        }

        const admin : Administrator = new Administrator(message.sender.userId);
        await admin.init();
        await message.reply(`Добро пожаловать!\n\n👤 Ник - ${admin.nick}\n🧸 Дата назначения - ${admin.appointment.toString}\n\nЧтобы посмотреть статистику пользователя, напиши "stats [пользователь]", где [пользователь] - ник модератора или его ВК.`)
    }

}