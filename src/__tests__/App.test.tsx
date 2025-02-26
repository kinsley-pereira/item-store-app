import React from 'react';
import { render, screen, fireEvent  } from '@testing-library/react';
import App from '../views/App';

jest.mock('../views/PlayerSelect', () => ({ onSelect }: any) => (
  	<button onClick={() => onSelect({ name: 'Player 1' })}>Select Player</button>
));

jest.mock('../views/Dashboard', () => ({ player, onUpdatePlayer, onSwitchPlayer }: any) => (
	<div>
		<h1>{player.name}</h1>
		<button onClick={() => onSwitchPlayer()}>Switch Player</button>
	</div>
));

describe('App Component', () => {
	test('Renders PlayerSelect when no player is selected', () => {
		render(<App />);
		expect(screen.getByText('Select Player')).toBeInTheDocument();
	});

	test('Renders Dashboard when a player is selected', () => {
		render(<App />);
		fireEvent.click(screen.getByText('Select Player'));
		expect(screen.getByText('Player 1')).toBeInTheDocument();
	});

	test('Returns to PlayerSelect when switching player', () => {
		render(<App />);
		fireEvent.click(screen.getByText('Select Player'));
		fireEvent.click(screen.getByText('Switch Player'));
		expect(screen.getByText('Select Player')).toBeInTheDocument();
	});
});
