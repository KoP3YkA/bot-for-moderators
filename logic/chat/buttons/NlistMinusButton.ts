import {BaseButtonExecutor} from "../../../core/classes/impl/executors/BaseButtonExecutor";
import {ChatButtonEvent} from "../../../core/classes/impl/events/ChatButtonEvent";
import {NamedChatButton} from "../../../core/annotations/routing/NamedChatButton";
import {Chat} from "../../../core/classes/impl/entity/Chat";
import {Member} from "../../../core/classes/impl/entity/Member";
import {User} from "../../../core/classes/impl/entity/User";
import {NameCase} from "../../../core/classes/impl/enums/NameCase";
import {Messages} from "../../../core/namespaces/Messages";
import {ButtonMessages, NicksMessage} from "../../base/ButtonMessages";
import {MinimalRank} from "../../../core/annotations/routing/MinimalRank";
import {Command} from "../../../core/classes/impl/enums/Command";

@NamedChatButton('nlist_minus')
@MinimalRank(Command.NLIST.minimalRank)
export class NlistMinusButton extends BaseButtonExecutor {

    public override async execute(message: ChatButtonEvent): Promise<void> {
        const page : number = message.getField<number>('page');
        if (page === 1) return await message.snackbar(`Это первая страница!`)
        const newPage : number = page+1;

        const willSendMessage : NicksMessage = await ButtonMessages.getNlist(message.chat, newPage)

        await message.editMessage({
            message: willSendMessage.message,
        }, ...willSendMessage.buttons)
    }

}