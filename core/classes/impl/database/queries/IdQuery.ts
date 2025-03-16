import {QueryResult, Result} from "modular-orm";

export class IdQuery extends QueryResult {

    @Result()
    public id : number = 0;

}