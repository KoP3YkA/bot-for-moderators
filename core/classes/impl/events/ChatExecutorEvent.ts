import {BaseEvent} from "../../base/events/BaseEvent";
import {ButtonColorUnion, KeyboardBuilder, MessageContext} from "vk-io";
import {Member} from "../entity/Member";
import {ChatEvent} from "../../../enums/ChatEvent";
import {Some} from "../../../types/Some";
import {MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {Chat} from "../entity/Chat";

export class ChatExecutorEvent extends BaseEvent {

    public apiEvent: MessageContext;
    public sender: Member;
    public target: Member | null;
    public eventType: ChatEvent;
    public chat : Chat;

    public constructor(event: MessageContext, eventType: ChatEvent) {
        super();
        this.apiEvent = event;
        this.sender = new Member(event.senderId, event.chatId as number)
        this.target = event.eventMemberId ? new Member(event.eventMemberId, event.chatId as number) : null
        this.eventType = eventType;
        this.chat = new Chat(event.chatId as number);
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

    /**
     * Без disable_mentions
     */
    public async send(params: MessagesSendParams | string, ...buttons: PayloadButton[]) : Some {
        const resButtons = this.getCallbackButtons(buttons)
        return await this.chat.send(typeof params === 'string' ? {message: params, keyboard: resButtons} : {...params, keyboard: resButtons})
    }

    /**
     * С disable_mentions
     */
    public async reply(params: MessagesSendParams | string, ...buttons: PayloadButton[]) : Some {
        return await this.send(typeof params === 'string' ? {message: params, disable_mentions: true} : {...params, disable_mentions: true}, ...buttons)
    }

}