import OpenAI from "openai";
import crypto from "crypto";
import { getRedis } from "../config/redis.js";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY
});

const PRIMARY_MODEL = "deepseek/deepseek-r1";
const FALLBACK_MODEL = "openai/gpt-4o-mini";

const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;
const CACHE_TTL = 60 * 5;

const hashPrompt = (prompt) =>
    crypto
        .createHash("sha256")
        .update(prompt)
        .digest("hex");

const sanitize = (raw) =>
    raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/[\x00-\x1F\x7F]/g, "")
        .trim();

const callModel = async (model, prompt) => {

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        TIMEOUT_MS
    );

    try {

        const completion =
            await client.chat.completions.create(
                {
                    model,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.2,
                    max_tokens: 2000
                },
                {
                    signal: controller.signal
                }
            );

        return completion
            .choices[0]
            .message
            .content;

    }
    finally {

        clearTimeout(timeout);

    }
};

/*
|--------------------------------------------------------------------------
| AI Suggestions
|--------------------------------------------------------------------------
| Used For:
| Departments
| Teams
| Tasks
| SubTasks
| WorkItems
| Reviews
|--------------------------------------------------------------------------
*/

export const generateSuggestion = async (prompt) => {

    try {

        const raw =
            await callModel(
                FALLBACK_MODEL,
                prompt
            );

        return sanitize(raw);

    }
    catch (err) {

        throw new Error(
            `Suggestion failed: ${err.message}`
        );

    }

};

/*
|--------------------------------------------------------------------------
| AI Analytics
|--------------------------------------------------------------------------
| Used For:
| Project Analysis
| Health
| Risk
| Deadline Prediction
| Workload
| Resource Prediction
| Productivity
| Bottlenecks
| Executive Summary
|--------------------------------------------------------------------------
*/

export const generateAnalysis = async (prompt) => {

    const cacheKey =
        `analytics:${hashPrompt(prompt)}`;

    let redis = null;

    try {

        redis = getRedis();

    }
    catch (_) {}

    if (redis) {

        try {

            const cached =
                await redis.get(cacheKey);

            if (cached) {
                return JSON.parse(cached);
            }

        }
        catch (_) {}

    }

    let lastError;

    for (
        let attempt = 0;
        attempt <= MAX_RETRIES;
        attempt++
    ) {

        try {

            const raw =
                await callModel(
                    PRIMARY_MODEL,
                    prompt
                );

            const cleaned =
                sanitize(raw);

            const parsed =
                JSON.parse(cleaned);

            if (redis) {

                try {

                    await redis.set(
                        cacheKey,
                        JSON.stringify(parsed),
                        "EX",
                        CACHE_TTL
                    );

                }
                catch (_) {}

            }

            return parsed;

        }
        catch (err) {

            lastError = err;

            if (
                attempt < MAX_RETRIES
            ) {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            (attempt + 1) * 1000
                        )
                );

            }

        }

    }

    try {

        const raw =
            await callModel(
                FALLBACK_MODEL,
                prompt
            );

        const cleaned =
            sanitize(raw);

        const parsed =
            JSON.parse(cleaned);

        if (redis) {

            try {

                await redis.set(
                    cacheKey,
                    JSON.stringify(parsed),
                    "EX",
                    CACHE_TTL
                );

            }
            catch (_) {}

        }

        return parsed;

    }
    catch (err) {

        throw new Error(
            `Analysis failed: ${
                lastError?.message ||
                err.message
            }`
        );

    }

};