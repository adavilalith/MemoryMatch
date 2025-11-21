import React from 'react';

/**
 * Renders the game header, including title, turns counter, New Game button, 
 * and the win message overlay.
 */
const Header = ({ turns, shuffleCards, disabled, isGameWon }) => {
    return (
        <>
            {/* Header section with title and controls */}
            <header className="w-full max-w-4xl flex justify-between items-center py-6 border-b border-gray-700 mb-8">
                <h1 className="text-4xl font-extrabold text-yellow-400 tracking-wider">
                    Memory Quest
                </h1>
                <div className="flex space-x-4">
                    <p className="text-lg font-medium bg-gray-800 px-4 py-2 rounded-lg shadow-md">
                        Turns: <span className="text-yellow-400 font-bold">{turns}</span>
                    </p>
                    <button 
                        onClick={shuffleCards} 
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-200 active:scale-95"
                        disabled={disabled} // Disabled during the 1s mismatch delay
                    >
                        New Game
                    </button>
                </div>
            </header>

            {/* Win Condition Message */}
            {isGameWon && (
                <div className="text-center p-6 bg-green-600/70 text-white rounded-xl mb-6 shadow-2xl w-full max-w-4xl">
                    <h2 className="text-3xl font-bold mb-2">🎉 Congratulations! You solved the puzzle in {turns} turns!</h2>
                    <button 
                        onClick={shuffleCards} 
                        className="mt-3 bg-white text-green-800 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </>
    );
};

export default Header;