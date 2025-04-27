function greet() {
    const nameInput = document.getElementById('nameInput');
    const greetingElement = document.getElementById('greeting');
    const name = nameInput.value.trim();

    if (name === '') {
        greetingElement.textContent = 'Please enter a name!';
        greetingElement.style.color = '#ff4444';
        return;
    }

    const greetings = [
        'Hello',
        'Hi',
        'Hey',
        'Greetings',
        'Welcome'
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    greetingElement.textContent = `${randomGreeting}, ${name}! 👋`;
    greetingElement.style.color = '#333';
    
    // Clear input after greeting
    nameInput.value = '';
}

// Allow Enter key to trigger greeting
document.getElementById('nameInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        greet();
    }
}); 