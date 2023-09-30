import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";

export async function POST(request: NextRequest) {
    const body = await request.json();
    if (!body.context) {
        return new NextResponse("Bad Request", { status: 400 });
    }
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
        messages: body.context.concat([
            {
                role: "system",
                content:
                    body.studyMode === "trivia"
                        ? "Generate a multiple choice question about the topic supplied by the user. The question should be easy to answer based on the topic, and should be easy to understand. The question should have 4 possible answers. The question should also be related to the topic provided by the user. Do not repeat any questions you already asked, and keep a diverse set of questions and answers. There must be at least 1 correct answer."
                        : "Generate a multiple choice question about the above paragraph you wrote about. The question should be easy to answer based on the paragraph you wrote, and should be easy to understand. The question should have 4 possible answers. The question should also be related to the topic provided by the user. Do not repeat any questions you already asked, and keep a diverse set of questions and answers. There must be at least 1 correct answer.",
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
        temperature: 0.9,
        presence_penalty: 0.6,
    };
    if (body.studyMode === "trivia" && body.context.length === 0) {
        const topic: ChatCompletionMessageParam[] = [
            { role: "user", content: `The topic is: ${body.topic}` },
        ];
        params.messages = topic.concat(params.messages);
    }
    const completion = await openai.chat.completions.create(params);
    if (!completion.choices[0].message.function_call) {
        return new NextResponse("Internal Server Error", { status: 400 });
    }
    const question = await JSON.parse(
        completion.choices[0].message.function_call.arguments
    );
    return NextResponse.json({
        messages: params.messages.concat([
            {
                role: "assistant",
                content: question.question,
            },
        ]),
        question: question.question,
        answers: question.answers,
    });
}
