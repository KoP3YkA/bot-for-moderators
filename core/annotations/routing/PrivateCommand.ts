import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const PrivateCommand = (command: string) => BaseRouting(RoutingMaps.PRIVATE_COMMANDS, command)