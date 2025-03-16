import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Chat} from "../../../../core/classes/impl/entity/Chat";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('server')
@WithAlias('grid')
@WithAlias('сервер')
export class ServerCommand extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        if (message.args.length < 1) return await message.reply(`Укажите название сетки!`)
        const grid : string = message.args[0];

        if (grid.length > 32) return await message.reply(`Название должно быть меньше 32 символов!`)

        const chat : Chat = message.chat;
        await chat.editServer(grid)
        await message.reply(`${await message.sender.getMention(NameCase.NOM)}, изменил-(а) сервер на <<${grid}>>`)
    }

}