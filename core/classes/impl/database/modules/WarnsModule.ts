import {
    AutoIncrementId,
    Migration,
    MigrationType,
    ModelAdapter,
    Module,
    NamedTable,
    SelectQueryParams,
    Table
} from "modular-orm";
import {IWarn} from "../../../../interfaces/entity/IWarn";
import {VarcharUUID} from "../../../../annotations/database/VarcharUUID";
import {TextColumn} from "../../../../annotations/database/TextColumn";
import {DateColumn} from "../../../../annotations/database/DateColumn";
import {Some} from "../../../../types/Some";
import {WarnQuery} from "../queries/WarnQuery";
import {TrueBooleanColumn} from "../../../../annotations/database/Boolean";

@Table
@NamedTable('warns')
export class WarnsModule extends Module implements IWarn {
    @AutoIncrementId
    public id : number = 0;

    @VarcharUUID
    public userId : string = "";

    @VarcharUUID
    public chatId : string = "";

    @VarcharUUID
    public moderator : string = "";

    @TextColumn
    public reason : string = "";

    @DateColumn
    public date : Date = new Date();

    @TrueBooleanColumn
    public active : boolean = true;

    public static create = async (values: { [key: string]: any }) : Some => await new ModelAdapter(WarnsModule).create(values);

    public static select = async (where: { [key: string] : any }, params?: Partial<SelectQueryParams>) : Promise<WarnQuery[]> => await new ModelAdapter(WarnsModule).select(WarnQuery, where, params)

    public static update = async (newValues: { [key: string] : any }, where?: { [key: string] : any }) : Some => await new ModelAdapter(WarnsModule).update(newValues, where);

    public static delete = async (where: { [key: string] : any }) : Some => await new ModelAdapter(WarnsModule).delete(where);

}