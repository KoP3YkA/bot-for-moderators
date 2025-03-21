import {BaseEvent} from "../../base/events/BaseEvent";
import {Moderator} from "../entity/Moderator";
import {ButtonColorUnion, KeyboardBuilder, MessageEventContext} from "vk-io";
import {Some} from "../../../types/Some";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {MessagesEditParams, MessagesSendParams} from "vk-io/lib/api/schemas/params";
import {Main} from "../../../../Main";

export class PrivateButtonEvent extends BaseEvent {

    public apiEvent : MessageEventContext
    public sender : Moderator;

    public constructor(event: MessageEventContext) {
        super();
        this.apiEvent = event;
        this.sender = new Moderator(event.userId);
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

    public async send(message: string | MessagesSendParams) : Some {
        await Main.getApi().sendMessage(typeof message === 'string' ? {message: message, peer_id: this.apiEvent.peerId, random_id: 0} : {...message, peer_id: this.apiEvent.peerId, random_id: 0})
    }

    public reply(t: any) : any {}

}