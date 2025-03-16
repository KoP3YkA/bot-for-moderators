import {BaseRouting} from "./BaseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";
import {ChatEvent} from "../../enums/ChatEvent";

export const ChatEventRouting = (event: ChatEvent) => BaseRouting(RoutingMaps.CHAT_EVENTS, event)