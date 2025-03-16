import {IsNumber, IsSafeString, QueryResult, Result, Validate} from "modular-orm";
import {INickname} from "../../../../interfaces/entity/INickname";
import {ToNumber} from "../../../../annotations/database/ToNumber";

export class NicknameQuery extends QueryResult implements INickname, Validate {
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
    @IsSafeString
    public nickname : string = "";

    public validateErrors: Set<string> = new Set();
}