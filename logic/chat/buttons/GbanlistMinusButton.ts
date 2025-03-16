import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";

@NamedChatButton('gbanlist_minus')
@MinimalRank(Command.GBANLIST.minimalRank)
export class GbanlistMinusButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const page : number = message.getField<number>('page');
        if (page === 1) return await message.snackbar(`Это первая страница!`)
        const newPage : number = page+1;
        const willSendMessage : NicksMessage = await ButtonMessages.getGbanlist(newPage)
        await message.editMessage({
            message: willSendMessage.message,
        }, ...willSendMessage.buttons)
    }

}