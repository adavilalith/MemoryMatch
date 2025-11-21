import React from 'react';

// Tailwind utilities for 3D flip effect (Kept here as they are tightly coupled to the card's styling)
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

/**
 * Renders a single flip card for the memory game.
 * All props are passed down from App.jsx's state and logic.
 */
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
        <>
            {/* The 3D CSS styles are necessary here for the card flip effect */}
            <style>{style}</style> 
            <div className={cardClass} onClick={handleClick}>
                <div className={`absolute inset-0 transform ${flipped ? 'rotate-y-180' : ''} transition-transform duration-500 preserve-3d`}>
                    
                    {/* Back side (The Question Mark) */}
                    <div className="absolute inset-0 backface-hidden bg-gray-800 rounded-lg flex items-center justify-center border-4 border-yellow-400 hover:bg-gray-700">
                        <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {/* Question Mark icon path */}
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2.5-1.5 2.5h-1v2m0 4h.01"></path>
                        </svg>
                    </div>

                    {/* Front side (The Image) */}
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
        </>
    );
};

export default Card;