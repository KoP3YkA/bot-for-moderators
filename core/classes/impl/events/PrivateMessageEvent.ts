import {BaseEvent} from "../../base/events/BaseEvent";
import {ButtonColorUnion, KeyboardBuilder, MessageContext} from "vk-io";
import {User} from "../entity/User";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {Some} from "../../../types/Some";
import {Moderator} from "../entity/Moderator";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {Nullable} from "../../../types/Nullable";
import {Member} from "../entity/Member";
import {Regex} from "../enums/Regex";
import {ModeratorsModule} from "../database/modules/ModeratorsModule";

export class PrivateMessageEvent extends BaseEvent {

    public apiEvent : MessageContext;
    public sender : Moderator;
    public text : string = '';
    public args: string[];

    public constructor(apiEvent: MessageContext) {
        super();
        this.apiEvent = apiEvent;
        this.sender = new Moderator(apiEvent.senderId);
        this.text = apiEvent.text ?? '';
        this.args = this.text.split(' ')
    }

    private getCallbackButtons(button: PayloadButton[]) {
        const keyboard = new KeyboardBuilder()
        keyboard.inline(true)
        for (const i of button) {
            keyboard.callbackButton({
                label: i.title,
                color: i.color as ButtonColorUnion,
                payload: i.payload
            })
        }
        return keyboard
    }

    public async getIdFromArgument(arg: number = 0, ignoreNicks : boolean = false) : Nullable<Moderator> {
        const allowGroups : boolean = false;
        const argsList : Array<string> = this.args;
        if (argsList.length < arg+1) return null;
        const currencyText : string = argsList[arg];

        if (!ignoreNicks) {
            const results = await ModeratorsModule.select({nickname: currencyText}, {order: 'id', limit: 1})
            if (results.length > 0) {
                return new Moderator(results[0].userId)
            }
        }

        let userId: number | string;
        if (!isNaN(+currencyText)) {
            userId = +currencyText;
            if ((userId < 0 && !allowGroups) || userId === 0) return null;
            return new Moderator(+currencyText);
        }

        let match : RegExpMatchArray | null;
        if ((match = currencyText.match(Regex.USER_OR_GROUP_MENTION))) {
            userId = currencyText.startsWith('[club') ? ~+match[2] + 1 : +match[2];
            return (userId < 0 && !allowGroups) ? null : new Moderator(userId);
        }

        if ((match = currencyText.match(Regex.URL_GET))) {
            userId = match[1];
            if (isNaN(+userId)) {
                const user = await User.instanceByTag(userId);
                return user.userId && (user.userId > 0 || allowGroups) ? new Moderator(user.userId) : null;
            }
            userId = +userId;
            return (userId && (userId > 0 || allowGroups)) ? new Moderator(userId) : null;
        }

        const user = await User.instanceByTag(currencyText);
        return user.userId && (user.userId > 0 || allowGroups) ? new Moderator(user.userId) : null;

    }

    public async send(message: MessagesSendParams | string, ...buttons: PayloadButton[]) : Some {
        const keyboard : KeyboardBuilder = this.getCallbackButtons(buttons);
        return await this.apiEvent.send(typeof message === 'string' ? {message, disable_mentions: true, keyboard: keyboard} : {...message, disable_mentions: true, keyboard: keyboard}).catch(err => {return err})
    }

    public async reply(message: MessagesSendParams | string, ...buttons: PayloadButton[]) : Some {
        const keyboard : KeyboardBuilder = this.getCallbackButtons(buttons);
        return await this.apiEvent.reply(typeof message === 'string' ? {message, disable_mentions: true, keyboard: keyboard} : {...message, disable_mentions: true, keyboard: keyboard}).catch(err => {return err})
    }

}