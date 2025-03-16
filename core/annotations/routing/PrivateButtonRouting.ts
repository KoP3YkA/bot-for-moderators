import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const PrivateButtonRouting = (button: string) => BaseRouting(RoutingMaps.PRIVATE_BUTTONS, button)