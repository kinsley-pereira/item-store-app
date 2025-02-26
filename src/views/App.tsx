import { useCallback, useState } from 'react';
import '../styles/app.scss';

import PlayerSelect from './PlayerSelect';
import Player from '../models/Player';
import Dashboard from './Dashboard';

export default function App() {
	const [player, setPlayer] = useState<Player|null>(null);

	const handleUpdatePlayer = useCallback((updatedPlayer: Player) => setPlayer(updatedPlayer), []);
	const handleSwitchPlayer = useCallback(() => setPlayer(null), []);

	return (
		<div className="app-wrapper">
			{ player === null ? (
				<PlayerSelect onSelect={setPlayer}/>
			) : (
				<Dashboard player={player} onUpdatePlayer={handleUpdatePlayer} onSwitchPlayer={handleSwitchPlayer}/>
			)}
		</div>
	);
}
