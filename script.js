document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const promptInput = document.getElementById('prompt');
  const sendBtn = document.getElementById('send-btn');
  const chatMessages = document.getElementById('chat-messages');
  const loadingOverlay = document.getElementById('loading-overlay');

  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  // Theme toggle functionality
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });

  // Auto-resize textarea as user types
  promptInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    
    // Reset height if empty
    if (this.value === '') {
      this.style.height = '';
    }
  });

  // Submit on Enter key (but allow Shift+Enter for new lines)
  promptInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  });
});

// Function to add a message to the chat UI
function addMessage(text, isUser) {
  const chatMessages = document.getElementById('chat-messages');
  
  // Create message elements
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'message user' : 'message system';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  
  // Assemble and add to chat
  contentDiv.appendChild(paragraph);
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to the latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Main generate function that handles the API call
async function generate() {
  const promptInput = document.getElementById('prompt');
  const loadingOverlay = document.getElementById('loading-overlay');
  const prompt = promptInput.value.trim();
  
  // Don't send empty messages
  if (!prompt) return;
  
  // Add user message to chat
  addMessage(prompt, true);
  
  // Clear input
  promptInput.value = '';
  promptInput.style.height = '';
  
  // Show loading overlay
  loadingOverlay.style.display = 'flex';

  try {
    // Send request to API
    const res = await fetch("https://zaynchat.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });
    
    const data = await res.json();
    
    // Hide loading overlay
    loadingOverlay.style.display = 'none';
    
    // Add AI response to chat
    if (data.response) {
      addMessage(data.response, false);
    } else if (data.error) {
      addMessage(`Error: ${data.error}`, false);
    } else {
      addMessage("Sorry, I couldn't generate a response.", false);
    }
    
  } catch (error) {
    // Hide loading overlay
    loadingOverlay.style.display = 'none';
    
    // Show error message
    addMessage(`Network error: ${error.message}. Please try again later.`, false);
    console.error("Error:", error);
  }
}
