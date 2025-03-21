import {User} from "../../impl/entity/User";
import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {KeyboardBuilder} from "vk-io";
import {ButtonAdapter} from "../../impl/adapter/ButtonAdapter";

export abstract class BaseEvent {
    public abstract apiEvent : any;
    public abstract sender : User;

    public abstract send(args: any) : any;
    public abstract reply(args: any) : any;

    protected getCallbackButtons(button: PayloadButton[]) : KeyboardBuilder {
        return ButtonAdapter.getCallbackButtons(button);
    }

}