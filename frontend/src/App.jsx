import React, { useState, useEffect } from 'react';

// --- Card Data (Simulating files in public/images/) ---
// NOTE: For this to work in a real environment, you must place these images 
// (e.g., helmet.png, potion.png) inside your project's public/images/ directory.
const cardImages = [
  { "src": "/images/img1.jpg", "name": "Helmet", matched: false },
  { "src": "/images/img2.jpg", "name": "Potion", matched: false },
  { "src": "/images/img3.jpg", "name": "Sword", matched: false },
  { "src": "/images/img4.jpg", "name": "Shield", matched: false },
  { "src": "/images/img5.jpg", "name": "Ring", matched: false },
  { "src": "/images/img6.jpg", "name": "Book", matched: false },
];

// --- Card Component ---
const Card = ({ card, handleChoice, flipped, matched, disabled }) => {
    // Determine the overlay class for matched cards
    const cardClass = `
        relative h-36 w-24 sm:h-40 sm:w-32 rounded-lg transition-transform duration-500 ease-in-out cursor-pointer shadow-xl
        ${matched ? 'opacity-50 pointer-events-none' : ''}
    `;

    // Handle click event: only allow interaction if the card is not disabled and not already flipped
    const handleClick = () => {
        if (!disabled && !flipped) {
            handleChoice(card);
        }
    };

    return (
        <div className={cardClass} onClick={handleClick}>
            <div className={`absolute inset-0 transform ${flipped ? 'rotate-y-180' : ''} transition-transform duration-500 preserve-3d`}>
                
                {/* Back side (Visible when NOT Flipped - Default View) */}
                <div className="absolute inset-0 backface-hidden bg-gray-800 rounded-lg flex items-center justify-center border-4 border-yellow-400 hover:bg-gray-700">
                  <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2.5-1.5 2.5h-1v2m0 4h.01"></path>
                  </svg>
                </div>

                {/* Front side (Visible when Flipped) - Starts rotated 180deg */}
                <div className="absolute inset-0 backface-hidden transform rotate-y-180 bg-white p-2 rounded-lg flex items-center justify-center border-4 border-yellow-500">
                    <img 
                        src={card.src} 
                        alt={card.name} 
                        className="max-h-full max-w-full object-contain" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x120/805ad5/ffffff?text=IMG' }} // Fallback
                    />
                </div>
            </div>
        </div>
    );
};

// Tailwind utilities for 3D flip effect
const style = `
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// --- Main Game Component ---
export default function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false); 
  // Removed isInitialPreview state

  // 1. Shuffle cards and start a new game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages] // Duplicate for pairs
      .sort(() => Math.random() - 0.5) // Shuffle randomly
      .map((card, index) => ({ 
        ...card, 
        id: index + 1, // Unique ID for each card instance
        isFlipped: false, // Start flipped down
        isMatched: false 
      }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatches(0);
    setDisabled(false); // Ensure clicks are enabled when a new game starts
  };

  // Removed useEffect handling the initial card preview timeout

  // 2. Handle a user choice (flip a card)
  const handleChoice = (card) => {
    // Prevent interaction if disabled (by comparison)
    if (disabled) return;

    if (choiceOne) {
      // Second choice
      if (card.id !== choiceOne.id) { // Prevent clicking the same card twice
        setChoiceTwo(card);
      }
    } else {
      // First choice
      setChoiceOne(card);
    }

    // Immediately flip the selected card in the UI
    setCards(prevCards => 
      prevCards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c)
    );
  };

  // 3. Comparison logic (runs when choiceOne and choiceTwo are set)
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true); // Disable further clicks during comparison

      if (choiceOne.name === choiceTwo.name) {
        // MATCH!
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.name === choiceOne.name) {
              return { ...card, isMatched: true };
            } else {
              return card;
            }
          });
        });
        setMatches(prevMatches => prevMatches + 1);
        resetTurn();
      } else {
        // NO MATCH! Wait 1 second, then flip back
        setTimeout(() => resetTurn(true), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // 4. Reset choices and increment turn counter
  const resetTurn = (isMismatch = false) => {
    if (isMismatch) {
        // If mismatch, flip the cards back down in the UI after the delay
        setCards(prevCards => 
            prevCards.map(card => {
                if (card.id === choiceOne.id || card.id === choiceTwo.id) {
                    return { ...card, isFlipped: false };
                } else {
                    return card;
                }
            })
        );
    }
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false); // Enable clicks again
  };

  // 5. Start the game automatically on first load
  useEffect(() => {
    shuffleCards();
  }, []);

  // 6. Check for Win condition
  const isGameWon = matches === cardImages.length && matches > 0;
  
  // 7. Render
  return (
    <>
      <style>{style}</style> {/* Apply 3D CSS utilities */}
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
        
        {/* Header */}
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
                disabled={disabled} // Only disabled during the 1s mismatch delay
              >
                New Game
              </button>
          </div>
        </header>

        {/* Game Board */}
        <main className="w-full max-w-4xl">
            {isGameWon && (
                <div className="text-center p-6 bg-green-600/70 text-white rounded-xl mb-6 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-2">🎉 Congratulations! You solved the puzzle in {turns} turns!</h2>
                    <button 
                        onClick={shuffleCards} 
                        className="mt-3 bg-white text-green-800 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition"
                    >
                        Play Again
                    </button>
                </div>
            )}
            
            {/* Grid Layout */}
            <div className={`grid grid-cols-4 gap-3 sm:gap-6 justify-items-center`}>
                {cards.map(card => (
                    <Card 
                        key={card.id}
                        card={card}
                        handleChoice={handleChoice}
                        // A card is 'flipped' if it's the current choice OR permanently matched
                        flipped={card.isFlipped || card.isMatched}
                        matched={card.isMatched}
                        // Disable clicks if a comparison is running, OR if the card is already matched
                        disabled={disabled || card.isMatched}
                    />
                ))}
            </div>
        </main>

        {/* Footer for Context */}
        <footer className="mt-12 text-gray-500 text-sm w-full max-w-4xl border-t border-gray-800 pt-4 text-center">
            <p>
                Memory Game built with React and Tailwind CSS. Images referenced from 
                <code className="bg-gray-800 p-1 rounded">/public/images/</code>.
            </p>
        </footer>
      </div>
    </>
  );
}