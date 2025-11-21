import React, { useState, useEffect } from 'react';
// FIX: Changing import paths to relative path within the 'src' directory
import Card from './components/Card.jsx'; 
import Header from './components/Header.jsx'; 

// --- Card Data (Simulating files in public/images/) ---
const cardImages = [
  { "src": "/images/img1.jpg", "name": "Helmet", matched: false },
  { "src": "/images/img2.jpg", "name": "Potion", matched: false },
  { "src": "/images/img3.jpg", "name": "Sword", "matched": false },
  { "src": "/images/img4.jpg", "name": "Shield", matched: false },
  { "src": "/images/img5.jpg", "name": "Ring", matched: false },
  { "src": "/images/img6.jpg", "name": "Book", matched: false },
];

// Define a constant for the storage key to avoid typos
const STORAGE_KEY = 'verrdeterra_game';

// --- Main Game Component ---
export default function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [matches, setMatches] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false); 

  // --- LOCAL STORAGE FUNCTIONS ---

  // Function to save the current game state to localStorage
  const saveGame = (currentCards, currentTurns, currentMatches) => {
    try {
      // 1. Snapshot the required state variables
      const gameState = {
        cards: currentCards,
        turns: currentTurns,
        matches: currentMatches,
        // We do NOT save choiceOne/Two as a paused game should reset the choices
        // and prevent mid-turn persistence.
      };
      
      // 2. Convert the object to a JSON string
      const jsonState = JSON.stringify(gameState);
      
      // 3. Store the string in localStorage
      localStorage.setItem(STORAGE_KEY, jsonState);
      console.log("Game state saved successfully.");
    } catch (e) {
      console.error("Error saving game state to localStorage:", e);
    }
  };

  // Function to load the saved game state from localStorage
  const loadGame = () => {
    try {
      const jsonState = localStorage.getItem(STORAGE_KEY);
      
      if (jsonState) {
        // 1. Convert the JSON string back into a JavaScript object
        const gameState = JSON.parse(jsonState);
        
        // 2. Use the retrieved data to restore the state
        setCards(gameState.cards);
        setTurns(gameState.turns);
        setMatches(gameState.matches);
        
        // Reset transient state
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
        
        console.log("Game state loaded from localStorage.");
        return true; // Indicates a successful load
      }
    } catch (e) {
      console.error("Error loading or parsing game state from localStorage:", e);
      // If loading fails, clear the bad data to start fresh next time
      localStorage.removeItem(STORAGE_KEY);
    }
    return false; // Indicates no saved game was found
  };
  
  // Function to clear saved game state (e.g., when a new game starts or game is won)
  const clearGame = () => {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Game state cleared.");
  }

  // --- LOGIC FUNCTIONS ---

  // 1. Shuffle cards and start a new game (Now clears saved state)
  const shuffleCards = () => {
    clearGame(); // Clear old state when starting new game
      
    const shuffledCards = [...cardImages, ...cardImages] 
      .sort(() => Math.random() - 0.5) 
      .map((card, index) => ({ 
        ...card, 
        id: index + 1, 
        isFlipped: false, 
        isMatched: false 
      }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatches(0);
    setDisabled(false); 
  };
  
  // 2. Handle a user choice (flip a card)
  const handleChoice = (card) => {
    if (disabled) return;

    if (choiceOne) {
      if (card.id !== choiceOne.id) { 
        setChoiceTwo(card);
      }
    } else {
      setChoiceOne(card);
    }

    setCards(prevCards => 
      prevCards.map(c => c.id === card.id ? { ...c, isFlipped: true } : c)
    );
  };

  // 4. Reset choices and increment turn counter
  const resetTurn = (isMismatch = false) => {
    // 1. Handle UI changes for mismatch (flip back)
    if (isMismatch) {
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
    
    // 2. Reset choices
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false); 
  };

  // --- EFFECT HOOKS ---

  // 3. Comparison logic (runs when choiceOne and choiceTwo are set)
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true); 

      if (choiceOne.name === choiceTwo.name) {
        // MATCH!
        setCards(prevCards => {
          // Update card state to isMatched: true
          const newCards = prevCards.map(card => {
            if (card.name === choiceOne.name) {
              return { ...card, isMatched: true };
            } else {
              return card;
            }
          });
          return newCards;
        });
        
        // 1. Update the official 'matches' count
        setMatches(prevMatches => prevMatches + 1);
        
        // 2. Increment turn count (Match case)
        setTurns(prevTurns => prevTurns + 1); 
        
        // 3. Reset choices
        resetTurn();
      } else {
        // NO MATCH! Wait 1 second, then flip back and increment turns
        setTimeout(() => {
            setTurns(prevTurns => prevTurns + 1); 
            resetTurn(true);
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]); 

  // 5. Initial Load logic (Now attempts to load saved game)
  useEffect(() => {
    const hasSavedGame = loadGame();
    if (!hasSavedGame) {
      // If no saved game is found, start a new one
      shuffleCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 6. Persistence useEffect: Save game state every time CARDS or TURNS changes
  useEffect(() => {
    // Only attempt to save if the cards array is initialized (i.e., not empty on first render)
    if (cards.length > 0) {
        // Save the state, but exclude saving if the game is already won
        const allMatched = cards.every(card => card.isMatched);
        if (!allMatched) {
             saveGame(cards, turns, matches);
        }
    }
  }, [cards, turns, matches]); // Depend on the state that changes frequently

  // 7. Check for Win condition (for display in Header)
  const isGameWon = matches === cardImages.length && matches > 0;

  // 8. ✅ CRITICAL ADDITION: Dedicated Win Effect
  // This ensures local storage is cleared reliably when the game is won.
  useEffect(() => {
    // Total unique cards is cardImages.length (6). Total matches needed is 6.
    if (isGameWon) {
        console.log("!!! GAME WON - Clearing Saved Game !!!");
        clearGame();
    }
  }, [isGameWon]); // Re-run whenever the win condition changes
  
  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      
      <Header 
        turns={turns}
        shuffleCards={shuffleCards}
        disabled={disabled}
        isGameWon={isGameWon}
      />

      <main className="w-full max-w-4xl">
        <div className={`grid grid-cols-4 gap-3 sm:gap-6 justify-items-center`}>
          {cards.map(card => (
            <Card 
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card.isFlipped || card.isMatched}
              matched={card.isMatched}
              disabled={disabled || card.isMatched}
            />
          ))}
        </div>
      </main>

      <footer className="mt-12 text-gray-500 text-sm w-full max-w-4xl border-t border-gray-800 pt-4 text-center">
          <p>
              Memory Game built with React and Tailwind CSS. Images referenced from 
              <code className="bg-gray-800 p-1 rounded">/public/images/</code>.
          </p>
      </footer>
    </div>
  );
}