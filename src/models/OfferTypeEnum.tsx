export enum OfferTypeEnum {
    Buy = 'B',
    Sell = 'S'
}

// Returns a Array with the options
export const offerTypeArray = Object.entries(OfferTypeEnum).map(([key, value]) => ({ key: value, label: key }));