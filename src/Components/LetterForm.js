import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { jsPDF } from 'jspdf'; // Import jsPDF
import './LetterForm.css';

function LetterForm() {
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [messages, setMessages] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const messagesRef = useRef([]);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('messages'));
    if (savedMessages) {
      setMessages(savedMessages);
      messagesRef.current = savedMessages;
    }
  }, []);

  // Countdown updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedMessages = [...messagesRef.current];
      let confettiTriggered = false;

      updatedMessages.forEach((msg, index) => {
        const isTimeUp = isCountdownOver(msg.deliveryDate, msg.deliveryTime);
        if (isTimeUp && !msg.shown) {
          confettiTriggered = true;
          msg.shown = true;
        }

        // Update countdown for each message
        const updatedCountdown = calculateCountdown(msg.deliveryDate, msg.deliveryTime);
        updatedMessages[index].countdown = updatedCountdown;
      });

      if (confettiTriggered) {
        setMessages(updatedMessages); // Trigger re-render when confetti is shown
        messagesRef.current = updatedMessages;
        localStorage.setItem('messages', JSON.stringify(updatedMessages));

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Show confetti for 5 seconds
      } else {
        setMessages(updatedMessages);
      }
    }, 1000); // Every second

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [messages]);

  // Function to check if countdown has finished
  const isCountdownOver = (date, time) => {
    const target = new Date(`${date}T${time}:00`).getTime();
    const now = new Date().getTime();
    return now >= target;
  };

  // Function to calculate countdown for each message
  const calculateCountdown = (deliveryDate, deliveryTime) => {
    const combinedDateTime = new Date(`${deliveryDate}T${deliveryTime}:00`);
    const now = new Date().getTime();
    const targetDate = combinedDateTime.getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
      return 'Time has come! ✨';
    } else {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  };

  const predictionsList = [
    "You’ll unlock a life-changing secret that shifts your destiny forever 🔮",
    "A wild dream you once laughed at will come true — big time 💥",
    "You’ll meet someone who alters your path in the most magical way ✨",
    "Your passion project will turn into a global sensation 🌍🚀",
    "A mysterious journey will take you to a place you’ve never imagined 🗺️🌠",
    "You’ll be known for something incredible you haven’t even discovered yet 🧠🔥",
    "You’ll receive a message that feels like it’s straight from the universe 🌌📩",
    "You’ll find your true calling when you least expect it — and it’ll feel perfect 🎯💡",
    "An unexpected twist will bring the happiness you’ve been searching for 🌈🌀",
    "Your future self will thank you for the bravery you show today 🦸‍♀️💫"
  ];
  

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message || !deliveryDate || !deliveryTime) {
      alert('Please enter a message, select a date, and choose a time.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * predictionsList.length);
    const randomPrediction = predictionsList[randomIndex];

    const newMessage = {
      message,
      deliveryDate,
      deliveryTime,
      prediction: randomPrediction,
      shown: false,
      countdown: calculateCountdown(deliveryDate, deliveryTime), // Initial countdown
    };

    const updatedMessages = [...messagesRef.current, newMessage];
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages;
    localStorage.setItem('messages', JSON.stringify(updatedMessages));

    setMessage('');
    setDeliveryDate('');
    setDeliveryTime('');
  };

  const handleDelete = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    messagesRef.current = updatedMessages;
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };
  
  // Function to download messages as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Messages for the Future:", 20, 20);
    let yPosition = 30;

    messages.forEach((msg, index) => {
      doc.setFontSize(14);
      doc.text(`Message ${index + 1}:`, 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.text(`Message: ${msg.message}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Delivery Date: ${msg.deliveryDate} at ${msg.deliveryTime}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Prediction: ${msg.prediction}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Countdown: ${msg.countdown}`, 20, yPosition);
      yPosition += 15;
    });

    // Save the generated PDF
    doc.save('messages.pdf');
  };

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} />}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Message to Future:</label><br />
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dear future me..."
          />
        </div>

        <div>
          <label>Delivery Date:</label><br />
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        <div>
          <label>Delivery Time:</label><br />
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />
        </div>

        <button type="submit">
          Submit Message 🚀
        </button>
      </form>

      <h3>Stored Messages:</h3>
      {messages.length === 0 ? (
        <p>No messages saved yet. Please add a message!</p>
      ) : (
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className="message-card">
              <h4>Message {index + 1}:</h4>
              <p className="message-text">{msg.message}</p>
              <p><strong>Delivery Date:</strong> {msg.deliveryDate} at {msg.deliveryTime}</p>
              <p><strong>Prediction:</strong> {msg.prediction}</p>
              <p><strong>Countdown:</strong> {msg.countdown}</p>
              <button onClick={() => handleDelete(index)} className="delete-btn">
                Delete Message ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={downloadPDF} className="download-btn">
        Download Messages as PDF 📥
      </button>
    </>
  );
}

export default LetterForm;
