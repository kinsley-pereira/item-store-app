import Player from "./Player";
import Item from "./Item";
import { OfferTypeEnum } from "./OfferTypeEnum";

/**
 * @description Represents an offer
 *
 * @interface Offer
 * @property {number} id - Offer ID
 * @property {Player} player - Player who made the offer
 * @property {Item} item - Item the offer refers to
 * @property {number} unitPrice - Price per unit
 * @property {number} amount - Amount of items included in the offer
 * @property {string} expiresAt - Offer expiration date
 * @property {OfferTypeEnum} type - Type of offer (Buy or Sell)
 * @property {string} createdAt - Offer creation date
 */
export default interface Offer {
    id: number;
    player: Player;
    item: Item;
    unitPrice: number;
    amount: number;
    expiresAt: string;
    type: OfferTypeEnum;
    createdAt?: string;
}