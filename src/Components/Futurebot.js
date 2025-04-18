// Components/Futurebot.js
import React, { useState } from 'react';
import './Futurebot.css';

function Futurebot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [reply, setReply] = useState('');

  const toggleBot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setReply("Hi! I'm Futurebot 🤖. Ask me anything about your future!");
    }
  };

  const getBotReply = (msg) => {
    const lower = msg.toLowerCase();
    // Basic category-based replies
    if (lower.includes("job")) return "You're destined to get your dream job 🔧";
    if (lower.includes("love")) return "Love is just around the corner ❤️";
    if (lower.includes("travel")) return "A journey awaits you ✈️";
    if (lower.includes("health")) return "You're going to feel amazing 🌿";
    if (lower.includes("wealth")) return "Your future is looking rich with opportunities 💰";
    if (lower.includes("friendship")) return "A close friend will bring good news soon 🤝";
    if (lower.includes("success")) return "Success is on your horizon! You will achieve your goals 🏆";
    if (lower.includes("adventure")) return "Get ready for an exciting adventure ahead 🏞️";
    if (lower.includes("luck")) return "Lady Luck is smiling on you today 🍀";
    if (lower.includes("family")) return "Your family will bring unexpected joy soon 👪";
    if (lower.includes("education")) return "Your efforts will lead to academic success 🎓";
    if (lower.includes("good vibes")) return "Everything will fall into place with positive energy ✨";
    
    
    return "Interesting... I see something exciting in your future! 🌟";
  };

  const handleSend = () => {
    if (!userMessage.trim()) return;
    const botResponse = getBotReply(userMessage);
    setReply(botResponse);
    setUserMessage('');
  };

  return (
    <>
      <div className="futurebot-icon" onClick={toggleBot}>
        🤖
      </div>

      {isOpen && (
        <div className="futurebot-window">
          <h3>Talk to Futurebot</h3>
          <div className="bot-reply">{reply}</div>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask your question..."
          />
          <button onClick={handleSend}>Ask</button>
        </div>
      )}
    </>
  );
}

export default Futurebot;
