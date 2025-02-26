import { useCallback, useMemo, useState } from "react";

import ItemService from "../services/ItemService";
import Item from "../models/Item";
import Player from "../models/Player";

import DataLoader from "../components/DataLoader";

import '../styles/panel-items.scss';

interface PanelItemsProps {
    player: Player;
}

export default function PanelItemsContent({ player }: PanelItemsProps) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [items, setItems] = useState<Item[]>([])

    // Filter items accoding to search query
    const filteredItems = useMemo(() => {
        let query = searchQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() // Normalize to remove accents
        return query ? items.filter(el => el.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(query)) : items
    }, [searchQuery, items])

    const loadData = useCallback(async () => {
        const response = await ItemService.getByPlayerId(player.id)
        setItems(response.data)
    }, [player.id])

    return <section className='panel-items'>
        <header>
            <h2>Items</h2>
        </header>
        <article className="app-window">
            <header>
                <input type="search" placeholder="Type here to search items" value={searchQuery} onChange={ev => setSearchQuery(ev.target.value)}/>
            </header>
            <DataLoader load={loadData}>
                <ul>
                    {filteredItems.map(item => (
                        <li key={item.id}>{item.name}<div className='badge'>{item.amount}</div></li>
                    ))}
                </ul>
            </DataLoader>
        </article>
    </section>
}