import Http from "./Http";
import Player from "../models/Player";

const baseURL = '/players';

const getAll = () => {
    return Http.get<Array<Player>>(baseURL);
};

const getById = (id: number) => {
    return Http.get<Player>(`${baseURL}/${id}`);
};

const PlayerService = {
    getAll,
    getById
};

export default PlayerService;