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

    // Language selection
    document.getElementById('language-select').addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(editor.getModel(), e.target.value);
    });

    // Run code button
    document.getElementById('run-code').addEventListener('click', () => {
        const code = editor.getValue();
        try {
            // For JavaScript, we can use eval (with caution)
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

function handleUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage('You', message);
    userInput.value = '';

    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
        const aiModel = document.getElementById('ai-model').value;
        const response = `This is a simulated response from ${aiModel}. In a real implementation, this would be an actual AI response based on your code and question.`;
        addMessage(aiModel, response);
    }, 1000);
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