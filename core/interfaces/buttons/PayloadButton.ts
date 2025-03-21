import {Color} from "../../classes/impl/enums/Color";

export interface PayloadButton {
    title: string,
    color: Color,
    payload: {[key: string]: any},
    newRow?: boolean
}