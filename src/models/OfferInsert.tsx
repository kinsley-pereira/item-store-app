import { OfferTypeEnum } from "./OfferTypeEnum";

/**
 * @description Represents an offer values from form
 *
 * @interface OfferInsert
 * @property {number} player - ID of the player who made the offer
 * @property {number} item - ID of the item the offer refers to
 * @property {number} unitPrice - Price per unit
 * @property {number} amount - Amount of items included in the offer
 * @property {string} expiresAt - Offer expiration date
 * @property {OfferTypeEnum} type - Type of offer (Buy or Sell)
 */
export interface OfferInsert {
    player: number;
    item: number;
    unitPrice: number;
    amount: number;
    expiresAt: Date;
    type: OfferTypeEnum;
}