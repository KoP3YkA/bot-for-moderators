import {Equals, IsNumber, IsSafeString, QueryResult, Result, Validate} from "modular-orm";
import {IGlobalBan} from "../../../../interfaces/entity/IGlobalBan";
import {Time} from "../../utils/Time";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToTime} from "../../../../annotations/database/ToTime";

export class GlobalBanQuery extends QueryResult implements IGlobalBan, Validate {
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