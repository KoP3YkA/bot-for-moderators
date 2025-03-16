import {AutoIncrementId, ModelAdapter, Module, NamedTable, SelectQueryParams, Table} from "modular-orm";
import {IPermissions} from "../../../../interfaces/entity/IPermissions";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {Tag} from "../../../../annotations/database/Tag";
import {Some} from "../../../../types/Some";
import {PermissionQuery} from "../queries/PermissionQuery";

@Table
@NamedTable('permissions')
export class PermissionsModule extends Module implements IPermissions {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public chatId : string = "";

    @VarcharUUID
    public userId : string = "";

    @Tag
    public role : string = "";

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(PermissionsModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<PermissionQuery[]> => await new ModelAdapter(PermissionsModule).select(PermissionQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(PermissionsModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(PermissionsModule).delete(where);

}