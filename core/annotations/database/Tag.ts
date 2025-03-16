import {ColumnAnnotationFabric, ColumnType} from "modular-orm";

export const Tag = ColumnAnnotationFabric.create({
    type: ColumnType.VARCHAR(32),
    notNull: true
})