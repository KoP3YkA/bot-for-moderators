import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {IBan} from "../../../../interfaces/entity/IBan";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {TextColumn} from "../../../../annotations/database/TextColumn";
import {DateColumn} from "../../../../annotations/database/DateColumn";
import {Some} from "../../../../types/Some";
import {BanQuery} from "../queries/BanQuery";

@Table
@NamedTable('bans')
export class BansModule extends Module implements IBan {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public chatId : string = "";

    @VarcharUUID
    public userId : string = "";

    @VarcharUUID
    public moderator : string = "";

    @TextColumn
    public reason : string = "";

    @DateColumn
    public date : Date = new Date();

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(BansModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<BanQuery[]> => await new ModelAdapter(BansModule).select(BanQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(BansModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(BansModule).delete(where);

}