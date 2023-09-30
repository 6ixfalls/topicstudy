import * as z from "zod";
import { formSchema } from "@/components/pages/topic";
import { ClockIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useTimer } from "react-timer-hook";
import { EffectCallback, useEffect, useRef, useState } from "react";
import OpenAI from "openai";

export const useEffectOnce = (effect: () => void | (() => void)) => {
    const destroyFunc = useRef<void | (() => void)>();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState<number>(0);

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    useEffect(() => {
        if (!effectCalled.current) {
            destroyFunc.current = effect();
            effectCalled.current = true;
        }

        setVal((val) => val + 1);

        return () => {
            if (!renderAfterCalled.current) {
                return;
            }
            if (destroyFunc.current) {
                destroyFunc.current();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default function Paragraph({
    topic,
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
    const { seconds, minutes, restart } = useTimer({
        expiryTimestamp: new Date(),
        onExpire: () => {
            setPage("question");
        },
        autoStart: false,
    });
    const [generating, setGenerating] = useState<boolean>(true);
    const [paragraph, setParagraph] = useState<string>("");
    useEffectOnce(() => {
        fetch("/api/paragraph", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic: topic.topic }),
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setParagraph(data.paragraph);
                setContext(data.messages);
                setGenerating(false);
                const date = new Date();
                date.setSeconds(date.getSeconds() + 300);
                restart(date, true);
            }
        });
    });

    return (
        <div className="container">
            <h1 className="text-xl font-semibold">Read the Passage</h1>
            <span className="flex flex-row items-center gap-1 mb-2">
                <ClockIcon />
                <span>
                    {generating ? "5" : minutes}:
                    {generating ? "00" : seconds.toString().padStart(2, "0")}
                </span>

                <Button
                    variant="secondary"
                    className="m-2"
                    onClick={() => restart(new Date(), true)}
                    disabled={generating}
                >
                    Skip Timer
                </Button>
            </span>
            {generating ? (
                <span className="animate-pulse">Loading Paragraph</span>
            ) : (
                <article>{paragraph}</article>
            )}
        </div>
    );
}
