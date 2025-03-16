import {ColumnAnnotationFabric, ColumnType} from "modular-orm";

export const DateColumn = ColumnAnnotationFabric.create({
    type: ColumnType.DATETIME,
    notNull: true
})