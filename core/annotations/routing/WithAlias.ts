import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const WithAlias = (alias: string) => BaseRouting(RoutingMaps.COMMAND_ALIASES, alias)