/**
 * @description Represents an item
 *
 * @interface Item
 * @property {number} id - Item's ID
 * @property {string} name - Item's anem
 * @property {number} amount - Item amount in the player inventory
 */
export default interface Item {
    id: number;
    name: string;
    amount: number;
}