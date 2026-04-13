import { NextResponse } from 'next/server';
import { AnthropicAPI } from 'anthropic';

const client = new AnthropicAPI({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await client.completions.create({
            model: 'claude-v1',
            prompt: body.prompt,
            max_tokens: 100,
        });
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error during API call:', error);
        return NextResponse.error();
    }
}