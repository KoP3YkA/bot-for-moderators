import {Equals, IsBoolean, IsNumber, IsSafeString, QueryResult, Result, Validate} from "modular-orm";
import {IWarn} from "../../../../interfaces/entity/IWarn";
import {Time} from "../../utils/Time";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToTime} from "../../../../annotations/database/ToTime";

export class WarnQuery extends QueryResult implements IWarn, Validate {
    @Result()
    @IsNumber
    public id : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public userId : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public chatId : number = 0;

    @Result()
    @IsNumber
    @ToNumber
    public moderator : number = 0;

    @Result()
    @IsSafeString
    public reason : string = "";

    @Result()
    @ToTime
    @Equals(Time)
    public date : Time = Time.currency;

    @Result()
    @IsBoolean
    public active : boolean = true;

    public validateErrors: Set<string> = new Set();
}