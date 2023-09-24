import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OAI_API_KEY,
    baseURL: process.env.OAI_BASE_PATH,
});

export default openai;
