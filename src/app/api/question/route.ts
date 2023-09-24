import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import OpenAI from "openai";

export async function POST() {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [{ role: "system", content: "Hello, how are you?" }],
        model: "gpt-3.5-turbo",
    };
    const completion = await openai.chat.completions.create(params);
    return NextResponse.json({
        paragraph: completion.choices[0].message.content,
    });
}
