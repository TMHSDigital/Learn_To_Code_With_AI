// Initialize Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: '// Write your code here\n',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false }
    });

    // Initialize AI Service
    const aiService = new AIService();

    // API Key setup
    const apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.placeholder = 'Enter OpenAI API Key';
    apiKeyInput.className = 'api-key-input';
    document.querySelector('.editor-toolbar').prepend(apiKeyInput);

    apiKeyInput.addEventListener('change', (e) => {
        aiService.setApiKey(e.target.value);
        localStorage.setItem('openai_api_key', e.target.value);
    });

    // Load saved API key
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        aiService.setApiKey(savedApiKey);
    }

    // Language selection
    document.getElementById('language-select').addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
    });

    // Run code button
    document.getElementById('run-code').addEventListener('click', () => {
        const code = editor.getValue();
        try {
            if (document.getElementById('language-select').value === 'javascript') {
                const result = eval(code);
                addMessage('System', `Code executed successfully. Result: ${result}`);
            } else {
                addMessage('System', 'Code execution is only supported for JavaScript in this demo.');
            }
        } catch (error) {
            addMessage('System', `Error: ${error.message}`);
        }
    });

    // Clear code button
    document.getElementById('clear-code').addEventListener('click', () => {
        editor.setValue('');
    });
});

// Chat functionality
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-message');

function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender.toLowerCase()}`;
    messageDiv.innerHTML = `
        <strong>${sender}:</strong>
        <p>${message}</p>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('You', message);
    userInput.value = '';

    try {
        const code = editor.getValue();
        const language = document.getElementById('language-select').value;
        const aiModel = document.getElementById('ai-model').value;

        addMessage('System', 'Analyzing code...');
        const response = await aiService.analyzeCode(code, language, message);
        addMessage(aiModel, response);
    } catch (error) {
        addMessage('System', `Error: ${error.message}`);
    }
}

sendButton.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage();
    }
});

// Example prompts
document.querySelectorAll('.example-prompts li').forEach(prompt => {
    prompt.addEventListener('click', () => {
        userInput.value = prompt.textContent;
        handleUserMessage();
    });
}); 