import {ColumnAnnotationFabric, ColumnType} from "modular-orm";

export const VarcharUUID = ColumnAnnotationFabric.create({
    type: ColumnType.VARCHAR(64),
    notNull: true,
})