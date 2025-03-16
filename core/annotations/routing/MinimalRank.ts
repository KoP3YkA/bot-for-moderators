import {Rank} from "../../classes/impl/enums/Rank";
import {ReverseRouting} from "./ReverseRouting";
import {RoutingMaps} from "../../namespaces/RoutingMaps";

export const MinimalRank = (rank: Rank) => ReverseRouting(RoutingMaps.BUTTON_MINIMAL_RANKS, rank)