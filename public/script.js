const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

function addMessage(content, isUser) {
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  div.textContent = content;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  chatInput.value = '';
  sendButton.disabled = true;

  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message typing';
  typingDiv.textContent = 'Thinking...';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    chatMessages.removeChild(typingDiv);
    addMessage(data.response || data.error, false);
  } catch (err) {
    chatMessages.removeChild(typingDiv);
    addMessage('Sorry, something went wrong. Please try again.', false);
  }

  sendButton.disabled = false;
  chatInput.focus();
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Welcome message
addMessage(
  "Hi! I'm the CloudDesk support assistant. How can I help you today?",
  false
);
