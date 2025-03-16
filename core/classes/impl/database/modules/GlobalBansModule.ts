import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {IGlobalBan} from "../../../../interfaces/entity/IGlobalBan";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {TextColumn} from "../../../../annotations/database/TextColumn";
import {DateColumn} from "../../../../annotations/database/DateColumn";
import {Some} from "../../../../types/Some";
import {GlobalBanQuery} from "../queries/GlobalBanQuery";

@Table
@NamedTable('gbans')
export class GlobalBansModule extends Module implements IGlobalBan {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    @VarcharUUID
    public moderator : string = "";

    @TextColumn
    public reason : string = "";

    @DateColumn
    public date : Date = new Date();

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(GlobalBansModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<GlobalBanQuery[]> => await new ModelAdapter(GlobalBansModule).select(GlobalBanQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(GlobalBansModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(GlobalBansModule).delete(where);

}