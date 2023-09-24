import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: [
            {
                role: "system",
                content:
                    "Create a 2 paragraph passage about the following topic provided by the user. Write the passage in a way that it is easy to understand, and easy to generate questions about afterwards.",
            },
            {
                role: "user",
                content: `The topic is: ${body.topic}`,
            },
        ],
        model: "gpt-3.5-turbo",
    };
    const completion = await openai.chat.completions.create(params);
    return NextResponse.json({
        messages: params.messages.concat(completion.choices[0].message),
        paragraph: completion.choices[0].message.content,
    });
}
