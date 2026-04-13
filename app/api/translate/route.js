const express = require('express');
const axios = require('axios');

const router = express.Router();

// POST handler for translating between Human and LinkedIn formats
router.post('/translate', async (req, res) => {
    const { mode, text } = req.body;

    if (!mode || !text) {
        return res.status(400).json({ error: 'Mode and text are required.' });
    }

    let prompt;
    if (mode === 'humanToLinkedin') {
        prompt = `Translate the following text to a LinkedIn style: 
        ${text}`;
    } else if (mode === 'linkedinToHuman') {
        prompt = `Translate the following LinkedIn text to a more human-readable style: 
        ${text}`;
    } else {
        return res.status(400).json({ error: 'Invalid mode. Use humanToLinkedin or linkedinToHuman.' });
    }

    try {
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

        res.json({ translatedText: response.data.completion });
    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = router;