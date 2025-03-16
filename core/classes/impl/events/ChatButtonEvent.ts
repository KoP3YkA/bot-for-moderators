import {BaseEvent} from "../../base/events/BaseEvent";
import {ButtonColorUnion, KeyboardBuilder, MessageContext, MessageEventContext} from "vk-io";
import {Member} from "../entity/Member";
import {Chat} from "../entity/Chat";
import {Some} from "../../../types/Some";
import {Main} from "../../../../Main";
import {MessagesEditParams, MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";

export class ChatButtonEvent extends BaseEvent {

    public apiEvent : MessageEventContext;
    public sender : Member;
    public chat : Chat;

    public command : string;

    public constructor(event: MessageEventContext) {
        super();
        this.apiEvent = event;
        this.sender = new Member(event.userId, event.peerId - 2_000_000_000)
        this.chat = new Chat(event.peerId - 2_000_000_000)
        this.command = event.eventPayload['command'] as string;
    }

    public getField<T>(field: string) : T {
        return this.apiEvent.eventPayload[field] as T;
    }

    public async snackbar(message: string) : Some {
        await this.apiEvent.answer({
            type: 'show_snackbar',
            text: message
        })
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

    public async editMessage(params: Partial<MessagesEditParams>, ...buttons: PayloadButton[]) : Some {
        const messageButtons : KeyboardBuilder | undefined = buttons.length < 1 ? undefined : this.getCallbackButtons(buttons)
        await Main.getApi().editMessage({
            ...params,
            cmid: this.apiEvent.conversationMessageId,
            peer_id: this.apiEvent.peerId,
            keyboard: messageButtons,
            keep_forward_messages: true
        })
    }

    public async send(params: MessagesSendParams | string) : Some {
        await this.chat.send(typeof params === 'string' ? {message: params} : params);
    }

    public getMessageText = async () : Promise<string> => await Main.getApi().getMessageText(this.chat.chatId, this.apiEvent.conversationMessageId)

    public reply(t: any) : void {}

}