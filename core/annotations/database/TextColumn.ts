import {ColumnAnnotationFabric, ColumnType} from "modular-orm";

export const TextColumn = ColumnAnnotationFabric.create({
    type: ColumnType.TEXT,
    notNull: true
})