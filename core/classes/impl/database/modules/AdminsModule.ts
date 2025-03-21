import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {IAdmin} from "../../../../interfaces/entity/IAdmin";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {DateColumn} from "../../../../annotations/database/DateColumn";
import {Some} from "../../../../types/Some";
import {BanQuery} from "../queries/BanQuery";
import {AdminQuery} from "../queries/AdminQuery";

@Table
@NamedTable('admins')
export class AdminsModule extends Module implements IAdmin {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    @VarcharUUID
    public nick : string = "";

    @DateColumn
    public appointment : Date = new Date();

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(AdminsModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<AdminQuery[]> => await new ModelAdapter(AdminsModule).select(AdminQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(AdminsModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(AdminsModule).delete(where);
}