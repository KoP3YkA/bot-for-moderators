import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const ProductRouting = (tag: string) => BaseRouting(RoutingMaps.PRODUCTS_EXECUTORS, tag);