import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";

@NamedChatButton('nlist_plus')
@MinimalRank(Command.NLIST.minimalRank)
export class NlistPlusButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const page : number = message.getField<number>('page');
        const willSendMessage : NicksMessage = await ButtonMessages.getNlist(message.chat, page+1);
        if (willSendMessage.error) return await message.snackbar(`Это последняя страница!`)
        await message.editMessage({
            message: willSendMessage.message
        }, ...willSendMessage.buttons)
    }

}