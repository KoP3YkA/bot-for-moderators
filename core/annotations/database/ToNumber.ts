import {TransformFactory} from "modular-orm";

export const ToNumber = TransformFactory.createTransform((value: any) => {
    return +value
})