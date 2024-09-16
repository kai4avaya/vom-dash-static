let messagesSample = [
    "Amanda Rome requests support with her call.",
    "Center 321 is experiencing greater call volume than usual.",
    "Agent Jake Morrison has completed his training session.",
    "New software update scheduled for Agent Terminals.",
    "System check: All call lines are operational.",
    "Agent Sarah Lee escalated a call to a supervisor.",
    "Center 145 has hit peak call volume, redirecting calls.",
    "Backup system for call routing activated.",
    "Agent Max Thompson is on a break.",
    "Weekly performance review meeting at 2 PM."
  ];
  let globMess;
  let messageIndex = 0;
  let charIndex = 0;
  let typingSpeed = 100; // Speed of typing
  let pauseBetweenMessages = 2000; // Pause between each full message
  
  const messageElement = document.getElementById("message-panel");
 export function typeWriter(messages = messagesSample, element = messageElement) {
  globMess = messages;
  messagesSample = messages;
    if (charIndex < messages[messageIndex].length) {
      // Display one character at a time
      element.innerHTML += messages[messageIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, typingSpeed);
    } else {
      // After full message is typed, wait then delete it
      setTimeout(deleteMessage, pauseBetweenMessages);
    }
  }
  
  function deleteMessage() {
    const deleteSpeed = 5; // Number of characters to delete at a time
    if (charIndex > 0) {
      // Remove a chunk of characters at a time (e.g., 5 characters)
      messageElement.innerHTML = globMess[messageIndex].substring(0, Math.max(0, charIndex - deleteSpeed));
      charIndex -= deleteSpeed; // Reduce the character index by deleteSpeed
      setTimeout(deleteMessage, typingSpeed / 4); // Make the delete super fast
    } else {
      // Move to the next message
      messageIndex = (messageIndex + 1) % globMess.length;
      setTimeout(typeWriter, typingSpeed);
    }
  }
  
  
  