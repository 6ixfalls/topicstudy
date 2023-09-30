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
                        ? "Generate 5 multiple choice questions about the topic supplied by the user. The questions should be easy to answer based on the topic, and should be easy to understand. The questions should have 4 possible answers. The questions should also be related to the topic provided by the user. Do not repeat any questions you already asked, and keep a diverse set of questions and answers. There must be at least 1 correct answer for each question."
                        : "Generate 5 multiple choice questions about the above paragraph you wrote about. The questions should be easy to answer based on the paragraph you wrote, and should be easy to understand. The questions should have 4 possible answers. The questions should also be related to the topic provided by the user. Do not repeat any questions you already asked, and keep a diverse set of questions and answers. There must be at least 1 correct answer for each question.",
            },
        ]),
        model: "gpt-3.5-turbo-0613",
        functions: [
            {
                name: "generate_questions",
                description:
                    "Add 5 questions to the context with the question and 4 possible answers.",
                parameters: {
                    type: "object",
                    properties: {
                        questions: {
                            type: "array",
                            items: {
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
    const questions = await JSON.parse(
        completion.choices[0].message.function_call.arguments
    );
    return NextResponse.json({
        messages: params.messages.concat([
            {
                role: "assistant",
                content: questions.questions
                    .map((q: any, i: number) => `${i}. ${q.question}`)
                    .join("\n"),
            },
        ]),
        questions: questions.questions,
    });
}
