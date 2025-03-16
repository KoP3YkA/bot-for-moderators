import {TransformFactory} from "modular-orm";
import {ChatType} from "../../enums/ChatType";

export const ToChatType = TransformFactory.createTransform((value: any) => {
    const types : Map<string, ChatType> = new Map([
        ['basic', ChatType.BASIC],
        ['player', ChatType.PLAYER],
        ['panel', ChatType.PANEL]
    ])
    return types.has(value) ? types.get(value) as ChatType : null
})