import {PayloadButton} from "../../../interfaces/buttons/PayloadButton";
import {ButtonColorUnion, KeyboardBuilder} from "vk-io";

export class ButtonAdapter {

    public static getCallbackButtons(button: PayloadButton[]) : KeyboardBuilder {
        const keyboard = new KeyboardBuilder()
        keyboard.inline(true)
        for (const i of button) {
            if (i.newRow) {
                keyboard.row()
            }
            keyboard.callbackButton({
                label: i.title,
                color: i.color as ButtonColorUnion,
                payload: i.payload
            })
        }
        return keyboard
    }

}