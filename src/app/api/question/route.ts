import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: body.context.concat([
            {
                role: "system",
                content:
                    "Generate a multiple choice question about the above paragraph you wrote about. The question should be easy to answer based on the paragraph you wrote, and should be easy to understand. The question should have 4 possible answers. The question should also be related to the topic provided by the user. Do not repeat any questions you already asked, and keep a diverse set of questions and answers.",
            },
        ]),
        model: "gpt-3.5-turbo-0613",
        functions: [
            {
                name: "generate_question",
                description:
                    "Add a question to the context with the question and 4 possible answers.",
                parameters: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        answers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    answer: { type: "string" },
                                    correct: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
            },
        ],
    };
    const completion = await openai.chat.completions.create(params);
    if (!completion.choices[0].message.function_call) {
        return new NextResponse("Internal Server Error", { status: 400 });
    }
    const question = await JSON.parse(
        completion.choices[0].message.function_call.arguments
    );
    return NextResponse.json({
        messages: params.messages.push({
            role: "assistant",
            content: question.question,
        }),
        question: question.question,
        answers: question.answers,
    });
}
