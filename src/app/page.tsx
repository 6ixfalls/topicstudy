"use client";
import Topic, { formSchema } from "@/components/pages/topic";
import Paragraph from "@/components/pages/paragraph";
import Question from "@/components/pages/question";
import { useState } from "react";
import * as z from "zod";

type PageType = "topic" | "paragraph" | "question";

function RenderPage(page: PageType, state: any) {
    switch (page) {
        case "topic":
            return <Topic {...state} />;
        case "paragraph":
            return <Paragraph {...state} />;
        case "question":
            return <Question {...state} />;
    }
}

export default function Home() {
    const [topic, setTopic] = useState<z.infer<typeof formSchema>>();
    const [page, setPage] = useState<PageType>("topic");
    const [context, setContext] = useState<any>([]);
    const [score, setScore] = useState<number>(0);
    const [questions, setQuestions] = useState<any>([]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {RenderPage(page, {
                context,
                setContext,
                topic,
                setTopic,
                setPage,
            })}
        </main>
    );
}
