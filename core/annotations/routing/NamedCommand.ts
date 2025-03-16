import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const NamedCommand = (commandName: string) => BaseRouting(RoutingMaps.CHAT_COMMANDS, commandName)