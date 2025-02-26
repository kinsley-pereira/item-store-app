import { memo, useCallback, useState } from "react"

import PlayerService from "../services/PlayerService"
import Player from "../models/Player"

import DataLoader from "../components/DataLoader"
import Select from "../components/Select"

import '../styles/view-player-select.scss'

interface UserSelectProps {
    onSelect(player: Player): void
}

export default memo(({onSelect}: UserSelectProps) => {
    const [players, setPlayers] = useState<Player[]>([])
    const [selectedPlayer, setSelectedPlayer] = useState<Player|null>(null)

    const loadData = useCallback(async () => {
        const response = await PlayerService.getAll()
        setPlayers(response.data)
    }, [])

    return <div className='app-window view-player-select'>
        <DataLoader load={loadData}>
            <form onSubmit={ev => ev.preventDefault()}>
                <label htmlFor="player-select-select">Select a player to impersonate</label>
                <Select<Player> id="player-select-select" options={players} onSelect={setSelectedPlayer} trackBy="id" label="name"/>
                <button className="mt-4" type="submit" onClick={() => selectedPlayer && onSelect(selectedPlayer)}>Impersonate</button>
            </form>
        </DataLoader>
    </div>
})