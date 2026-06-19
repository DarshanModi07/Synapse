import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY
});

export const generateSuggestion = async (prompt) => {

    const completion = await client.chat.completions.create({

            model: "openai/gpt-4o-mini",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.3
        });

    return completion
        .choices[0]
        .message
        .content;
};