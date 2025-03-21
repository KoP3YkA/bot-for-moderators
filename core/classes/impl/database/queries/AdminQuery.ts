import {IsNumber, IsSafeString, QueryResult, Result, Validate} from "modular-orm";
import {IAdmin} from "../../../../interfaces/entity/IAdmin";
import {Time} from "../../utils/Time";
import {ToTime} from "../../../../annotations/database/ToTime";
import {ToNumber} from "../../../../annotations/database/ToNumber";

export class AdminQuery extends QueryResult implements IAdmin, Validate {
    @Result()
    @IsNumber
    public id : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public userId : number = 0;

    @Result()
    @IsSafeString
    public nick : string = "";

    @Result()
    @ToTime
    public appointment : Time = Time.currency;

    public validateErrors: Set<string> = new Set();
}