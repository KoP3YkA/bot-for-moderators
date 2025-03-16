import {TransformFactory} from "modular-orm";
import {Rank} from "../../classes/impl/enums/Rank";

export const ToRank = TransformFactory.createTransform((value: any) => {
    return Rank.findByTag(String(value))
})