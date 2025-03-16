import {BaseCommandExecutor} from "../../../../core/classes/impl/executors/BaseCommandExecutor";
import {ChatMessageEvent} from "../../../../core/classes/impl/events/ChatMessageEvent";
import {Some} from "../../../../core/types/Some";
import {NamedCommand} from "../../../../core/annotations/routing/NamedCommand";
import {WithAlias} from "../../../../core/annotations/routing/WithAlias";
import {Cash} from "../../../../core/namespaces/Cash";
import {NameCase} from "../../../../core/classes/impl/enums/NameCase";

@NamedCommand('sync')
@WithAlias('синх')
@WithAlias('синхра')
@WithAlias('синхронизация')
export class Sync extends BaseCommandExecutor {

    public override async execute(message: ChatMessageEvent): Some {
        Cash.CHAT_TITLES.clear();
        Cash.USER_TAGS.clear();
        await message.reply(`${await message.sender.getMention(NameCase.NOM)}, бот успешно синхронизирован (кэш был очищен)!`)
    }

}