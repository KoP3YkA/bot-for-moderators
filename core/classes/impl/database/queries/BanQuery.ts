import {Equals, IsNumber, IsSafeString, QueryResult, Result, Validate} from "modular-orm";
import {IBan} from "../../../../interfaces/entity/IBan";
import {Time} from "../../utils/Time";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToTime} from "../../../../annotations/database/ToTime";

export class BanQuery extends QueryResult implements IBan, Validate {
    @Result()
    @IsNumber
    public id : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public chatId : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public userId : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public moderator : number = 0;

    @Result()
    @IsSafeString
    public reason : string = "";

    @Result()
    @ToTime
    @Equals(Time)
    public date : Time = Time.currency;

    public validateErrors: Set<string> = new Set();
}