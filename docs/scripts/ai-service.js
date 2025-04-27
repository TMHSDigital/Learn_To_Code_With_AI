class AIService {
    constructor() {
        this.baseUrl = 'https://api.openai.com/v1';
        this.apiKey = ''; // Will be set by user
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async analyzeCode(code, language, prompt) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert ${language} programmer. Analyze the following code and provide helpful feedback.`
                    },
                    {
                        role: 'user',
                        content: `Code:\n${code}\n\nQuestion: ${prompt}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error('AI service request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Export for use in other files
window.AIService = AIService; 