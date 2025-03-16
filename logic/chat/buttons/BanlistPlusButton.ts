import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";

@NamedChatButton('banlist_plus')
@MinimalRank(Command.BANLIST.minimalRank)
export class BanlistPlusButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const page : number = message.getField<number>('page');
        const willSendMessage : NicksMessage = await ButtonMessages.getBanlist(message.chat, page+1);
        if (willSendMessage.error) return await message.snackbar(`Это последняя страница!`)
        await message.editMessage({
            message: willSendMessage.message
        }, ...willSendMessage.buttons)
    }

}