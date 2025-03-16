import {TransformFactory} from "modular-orm";
import {Time} from "../../classes/impl/utils/Time";

export const ToTime = TransformFactory.createTransform((value: any) => {
    if (!(value instanceof Date)) return null;
    return new Time(value);
})