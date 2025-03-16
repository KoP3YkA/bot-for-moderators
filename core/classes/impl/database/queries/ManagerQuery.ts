import {Equals, IsNumber, QueryResult, Result, Validate} from "modular-orm";
import {IManager} from "../../../../interfaces/entity/IManager";
import {Rank} from "../../enums/Rank";
import {ToNumber} from "../../../../annotations/database/ToNumber";
import {ToRank} from "../../../../annotations/database/ToRank";

export class ManagerQuery extends QueryResult implements IManager, Validate {
    @Result()
    @IsNumber
    public id : number = 0;
    @Result()
    @ToNumber
    @IsNumber
    public userId : number = 0;

    @Result()
    @ToRank
    @Equals(Rank)
    public rang : Rank = Rank.DEFAULT;

    public validateErrors: Set<string> = new Set();
}