import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {Member} from "../../../../core/classes/impl/entity/Member";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Messages} from "../../../../core/namespaces/Messages";

@NamedCommand('info')
@WithAlias('инфо')
export class Info extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent) : Some {
        const sender : Member = message.sender;
        await sender.init();

        await message.reply({message: Messages.INFO_MESSAGE})
    }

}