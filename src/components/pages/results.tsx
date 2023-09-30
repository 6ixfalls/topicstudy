import OpenAI from "openai";
import * as z from "zod";
import { formSchema } from "./topic";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import useSound from "use-sound";

function getResultColor(answer: any, submitted: string) {
    if (answer.correct) {
        return "bg-green-800";
    } else if (submitted === answer.answer) {
        return "bg-red-800";
    }
    return "";
}

export default function Results({
    topic,
    setPage,
    setContext,
    score,
    setScore,
    questions,
    setQuestions,
    setQuestionIndex,
    results,
    setResults,
}: {
    topic: z.infer<typeof formSchema>;
    setTopic: (topic: z.infer<typeof formSchema>) => void;
    setPage: (page: string) => void;
    context: OpenAI.Chat.ChatCompletionCreateParams["messages"];
    setContext: (
        context: OpenAI.Chat.ChatCompletionCreateParams["messages"]
    ) => void;
    score: number;
    setScore: (score: number) => void;
    questions: number;
    setQuestions: (questions: number) => void;
    questionIndex: number;
    setQuestionIndex: (questionIndex: number) => void;
    results: any[];
    setResults: (results: any[]) => void;
}) {
    const [play] = useSound("/tada.wav");
    if (score === questions) {
        play();
    }
    return (
        <div className="container">
            <h1 className="text-xl font-semibold">Your results</h1>
            <div className="flex flex-row space-x-2">
                Score: {score}/{questions}
            </div>
            <article>
                {results.map((result, i) => (
                    <>
                        <span className="text-lg font-semibold">
                            Question {i + 1}
                        </span>
                        <div>{result.question}</div>
                        <div className="my-4">
                            <RadioGroup className="flex flex-col">
                                {result.answers.map(
                                    (answer: any, i: number) => (
                                        <div
                                            className={
                                                getResultColor(
                                                    answer,
                                                    result.answer
                                                ) +
                                                " flex items-center space-x-2 p-2 rounded-full transition-colors"
                                            }
                                            key={i}
                                        >
                                            <RadioGroupItem
                                                value={answer.answer}
                                                disabled
                                                id={`answer-${i}`}
                                                checked={
                                                    answer.answer ===
                                                    result.answer
                                                }
                                            />
                                            <Label htmlFor={`answer-${i}`}>
                                                {answer.answer}
                                            </Label>
                                        </div>
                                    )
                                )}
                            </RadioGroup>
                        </div>
                    </>
                ))}

                <div className="flex flex-row space-x-2">
                    <Button
                        type="button"
                        onClick={() => {
                            setContext([]);
                            setScore(0);
                            setQuestions(0);
                            setQuestionIndex(0);
                            setResults([]);
                            if (topic.studyMode === "passage") {
                                setPage("paragraph");
                            } else {
                                setPage("question");
                            }
                        }}
                    >
                        Retry
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setContext([]);
                            setScore(0);
                            setQuestions(0);
                            setQuestionIndex(0);
                            setResults([]);
                            setPage("topic");
                        }}
                    >
                        Start Over
                    </Button>
                </div>
            </article>
        </div>
    );
}
