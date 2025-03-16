import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {IManager} from "../../../../interfaces/entity/IManager";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {Tag} from "../../../../annotations/database/Tag";
import {Some} from "../../../../types/Some";
import {PermissionQuery} from "../queries/PermissionQuery";
import {ManagerQuery} from "../queries/ManagerQuery";

@Table
@NamedTable('managers')
export class ManagersModule extends Module implements IManager {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    @Tag
    public rang : string = "";

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(ManagersModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<ManagerQuery[]> => await new ModelAdapter(ManagersModule).select(ManagerQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(ManagersModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(ManagersModule).delete(where);
}