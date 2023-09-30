import OpenAI from "openai";
import { useState } from "react";
import { useEffectOnce } from "./paragraph";
import * as z from "zod";
import { formSchema } from "./topic";

export default function Question({
    topic,
    context,
    setPage,
    setContext,
}: {
    topic: z.infer<typeof formSchema>;
    setTopic: (topic: z.infer<typeof formSchema>) => void;
    setPage: (page: string) => void;
    context: OpenAI.Chat.ChatCompletionCreateParams["messages"];
    setContext: (
        context: OpenAI.Chat.ChatCompletionCreateParams["messages"]
    ) => void;
}) {
    const [generating, setGenerating] = useState<boolean>(true);
    const [question, setQuestion] = useState<string>("");
    useEffectOnce(() => {
        fetch("/api/question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context }),
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setQuestion(data.question);
                setContext(data.messages);
                setGenerating(false);
            }
        });
    });
    return (
        <div className="container">
            <h1 className="text-xl font-semibold">Answer the question</h1>
            <span className="flex flex-row items-center gap-1 mb-2">
                Answer the question below based on the passage you just read.
            </span>
            {generating ? (
                <span className="animate-pulse">Loading Question</span>
            ) : (
                <article>{question}</article>
            )}
        </div>
    );
}
