import {BaseExecutor} from "../../../../core/classes/base/executors/BaseExecutor";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {Command} from "../../../../core/classes/impl/enums/Command";

@NamedCommand('help')
@WithAlias('помощь')
@WithAlias('помощ')
@WithAlias('хелп')
export class Help extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const sender : Member = message.sender;
        await sender.init();

        await message.reply({
            message: Command.getCommandsStringByRank(sender.rank)
        })
    }

}