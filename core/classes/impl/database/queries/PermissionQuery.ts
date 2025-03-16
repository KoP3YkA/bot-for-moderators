import {IsNumber, NotEquals, QueryResult, Result, Validate} from "modular-orm";
import {IPermissions} from "../../../../interfaces/entity/IPermissions";
import {Rank} from "../../enums/Rank";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToRank} from "../../../../annotations/database/ToRank";

export class PermissionQuery extends QueryResult implements IPermissions, Validate {
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
    @ToRank
    @NotEquals(Rank.DEFAULT)
    public role : Rank = Rank.DEFAULT;

    public validateErrors: Set<string> = new Set();
}