import {TransformFactory} from "modular-orm";
import {ModeratorType} from "../../classes/impl/enums/ModeratorType";

export const ToModeratorType = TransformFactory.createTransform((value: any) => {
    return ModeratorType.findByTag(String(value))
})