import axios from 'axios';

// POST handler for translating between Human and LinkedIn formats
export async function POST(request) {
    try {
        const { mode, text } = await request.json();

        if (!mode || !text) {
            return Response.json(
                { error: 'Mode and text are required.' },
                { status: 400 }
            );
        }

        let prompt;
        if (mode === 'humanToLinkedin') {
            prompt = `Translate the following text to a LinkedIn style: 
            ${text}`;
        } else if (mode === 'linkedinToHuman') {
            prompt = `Translate the following LinkedIn text to a more human-readable style: 
            ${text}`;
        } else {
            return Response.json(
                { error: 'Invalid mode. Use humanToLinkedin or linkedinToHuman.' },
                { status: 400 }
            );
        }

        const response = await axios.post('https://api.anthropic.com/v1/claude', {
            model: 'claude-sonnet-4-20250514',
            prompt: prompt,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer YOUR_ANTHROPIC_API_KEY`,
                'Content-Type': 'application/json'
            }
        });

        return Response.json({ translatedText: response.data.completion });
    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        return Response.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}
