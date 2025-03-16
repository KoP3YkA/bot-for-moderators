import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {INickname} from "../../../../interfaces/entity/INickname";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {TextColumn} from "../../../../annotations/database/TextColumn";
import {Some} from "../../../../types/Some";
import {NicknameQuery} from "../queries/NicknameQuery";

@Table
@NamedTable('nicknames')
export class NicknamesModule extends Module implements INickname {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    @VarcharUUID
    public chatId : string = "";

    @TextColumn
    public nickname : string = "";

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(NicknamesModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<NicknameQuery[]> => await new ModelAdapter(NicknamesModule).select(NicknameQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(NicknamesModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(NicknamesModule).delete(where);

}