import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_VISION_MODELS = [
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3.5-super-vl:free",
    "thinkingmachines/inkling:free",
];

export const extractWithNvidia = async (prompt, imageData = null) => {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY is missing. Check your .env file.");
    }

    const content = [{ type: "text", text: prompt }];

    if (imageData) {
        content.push({
            type: "image_url",
            image_url: { url: imageData }
        });
    }

    let lastError = null;

    for (const model of FREE_VISION_MODELS) {
        try {
            console.log(`Trying model: ${model}`);

            const response = await axios.post(
                OPENROUTER_API_URL,
                {
                    model,
                    messages: [{ role: "user", content }],
                    temperature: 0.2,
                    max_tokens: 2000,
                    stream: false
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 120000
                }
            );

            const data = response.data;


            if (!data.choices || data.choices.length === 0) {
                console.warn(`Model ${model} returned no choices:`, JSON.stringify(data, null, 2));
                lastError = new Error(data.error?.message || `Model ${model} returned no choices.`);
                continue;
            }

            console.log(`Success with model: ${model}`);
            return data.choices[0].message.content;

        } catch (error) {
            const status = error.response?.status;
            console.warn(`Model ${model} failed (HTTP ${status}):`, error.response?.data?.error?.message || error.message);


            if (status === 429 || status === 404) {
                lastError = error;
                continue; // try next model
            }


        }
    }

    // All models exhausted
    console.error("All free vision models are unavailable.");
    throw lastError || new Error("All free vision models are rate-limited or unavailable. Please try again later.");
};