import {
    Equals,
    IsBoolean,
    IsNotNull,
    IsNumber,
    IsSafeString,
    IsString,
    IsUUID, Max,
    Min,
    QueryResult,
    Result, Validate
} from "modular-orm";
import {IModerator} from "../../../../interfaces/entity/IModerator";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToModeratorType} from "../../../../annotations/database/ToModeratorType";
import {ToTime} from "../../../../annotations/database/ToTime";
import {Time} from "../../utils/Time";
import {ModeratorType} from "../../enums/ModeratorType";

export class ModeratorQuery extends QueryResult implements IModerator, Validate {
    @Result()
    @IsNumber
    public id : number = 0;

    @Result()
    @ToNumber
    @IsNumber
    public userId : number = 0;

    @Result()
    @ToModeratorType
    @IsNotNull
    public moderatorType : ModeratorType = ModeratorType.BASIC;

    @Result()
    @IsString
    public rang : string = "";

    @Result()
    @IsSafeString
    public nickname : string = "";

    @Result()
    @ToTime
    @Equals(Time)
    public firstAppointment : Time = Time.currency;

    @Result()
    @ToTime
    @Equals(Time)
    public lastAppointment : Time = Time.currency;

    @Result()
    @IsBoolean
    public hasPc : boolean = false;

    @Result()
    @IsNumber
    public points : number = 0;

    @Result()
    @IsUUID
    public discord : string = "";

    @Result()
    @IsString
    public forum : string = "";

    @Result()
    @ToNumber
    @IsNumber
    @Min(13)
    @Max(100)
    public age : number = 0;

    @Result()
    @IsNumber
    @Max(2)
    @Min(0)
    public preds : number = 0;

    @Result()
    @IsNumber
    @Max(3)
    @Min(0)
    public vigs : number = 0;

    @Result()
    @IsBoolean
    public aban : boolean = false;

    public validateErrors: Set<string> = new Set();

}