import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {Some} from "../../../../types/Some";
import {ChatQuery} from "../queries/ChatQuery";
import {IdQuery} from "../queries/IdQuery";

@Table
@NamedTable('firstMessages')
export class FirstMessagesModule extends Module {

    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(FirstMessagesModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<IdQuery[]> => await new ModelAdapter(FirstMessagesModule).select(IdQuery, where, params)

}