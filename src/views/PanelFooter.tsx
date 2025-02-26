import Player from "../models/Player"

import '../styles/panel-footer.scss'

interface PanelFooterProps {
    player: Player
    onSwitchPlayer(): void
    onCreateOffer(): void
}

export default function PanelFooter({ player, onSwitchPlayer, onCreateOffer }: PanelFooterProps) {
    return <footer className='panel-footer app-window'>
        <p><b>Gold:</b> {player.gold.toLocaleString('en')}</p>
        <div className="buttons-container">
            <button onClick={onSwitchPlayer}>Switch Player</button>
            <button onClick={onCreateOffer}>Create Offer</button>
        </div>
    </footer>
}