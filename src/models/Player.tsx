/**
 * @description Represents a player
 *
 * @interface Offer
 * @property {number} id - Player's ID
 * @property {string} name - Player's name
 * @property {number} gold - Player's current gold
 */
export default interface Player {
    id: number;
    name: string;
    gold: number;
}