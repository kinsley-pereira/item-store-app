import Http from "./Http";
import Item from "../models/Item";

const baseURL = '/items';

const getAll = () => {
    return Http.get<Array<Item>>(baseURL);
};

const getByPlayerId = (id: number) => {
    return Http.get<Array<Item>>(`${baseURL}/${id}`);
};

const ItemService = {
    getAll,
    getByPlayerId
};

export default ItemService;