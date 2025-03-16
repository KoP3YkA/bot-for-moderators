import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const NamedChatButton = (button: string) => BaseRouting(RoutingMaps.CHAT_BUTTONS, button)