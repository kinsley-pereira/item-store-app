import Http from "./Http";
import Offer from "../models/Offer";
import { OfferTypeEnum } from "../models/OfferTypeEnum";
import { OfferInsert } from "../models/OfferInsert";

const baseURL = '/offers';

const getByType = (type: OfferTypeEnum) => {
    return Http.get<Array<Offer>>(`${baseURL}/${type}`);
};

const create = (offer: OfferInsert) => {
    return Http.post(`${baseURL}`, offer);
};

const OfferService = {
    getByType,
    create
};

export default OfferService;