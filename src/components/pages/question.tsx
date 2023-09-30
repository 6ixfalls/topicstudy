import OpenAI from "openai";
import { useState } from "react";
import { useEffectOnce } from "./paragraph";
import * as z from "zod";
import { formSchema } from "./topic";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import useSound from "use-sound";

const questionSchema = z.object({
    answer: z.string().min(1, { message: "Pick an answer." }),
});

function getResultColor(form: any, submitted: boolean, answer: any) {
    if (submitted) {
        if (answer.correct) {
            return "bg-green-800";
        } else if (form.getValues("answer") === answer.answer) {
            return "bg-red-800";
        }
    }
    return "";
}

export default function Question({
    topic,
    context,
    setPage,
    setContext,
    score,
    setScore,
    questions,
    setQuestions,
    questionIndex,
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
    const form = useForm<z.infer<typeof questionSchema>>({
        resolver: zodResolver(questionSchema),
    });
    const [generating, setGenerating] = useState<boolean>(true);
    const [question, setQuestion] = useState<string>("");
    const [answers, setAnswers] = useState<any[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);
    const [play] = useSound("/correct.wav");
    useEffectOnce(() => {
        fetch("/api/question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                context,
                topic: topic.topic,
                studyMode: topic.studyMode,
            }),
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setQuestion(data.question);
                setAnswers(data.answers);
                setContext(data.messages);
                setGenerating(false);
            }
        });
    });
    function onSubmit(values: z.infer<typeof questionSchema>) {
        const answer = answers.find(
            (answer) => answer.answer === values.answer
        );
        setQuestions(questions + 1);
        if (answer.correct) {
            setScore(score + 1);
            setCorrect(true);
            play();
        } else {
            setCorrect(false);
        }
        setResults([
            ...results,
            {
                question,
                answer: values.answer,
                correct: answer.correct,
                answers,
            },
        ]);
        setSubmitted(true);
    }
    return (
        <div className="container">
            <h1 className="text-xl font-semibold">Answer the question</h1>
            <span className="flex flex-row items-center gap-1 mb-2">
                Answer the question below based on{" "}
                {topic.studyMode === "passage"
                    ? "the passage you just read."
                    : "your knowledge of the topic."}
            </span>
            <div className="flex flex-row space-x-2">
                Score: {score}/{questions}
            </div>
            {generating ? (
                <span className="animate-pulse">Loading Question</span>
            ) : (
                <article>
                    <span className="text-lg font-semibold">
                        Question {questionIndex + 1}
                    </span>
                    <div>{question}</div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem className="my-4">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col"
                                            >
                                                {answers.map((answer, i) => (
                                                    <FormItem
                                                        className="basis-0 flex-grow"
                                                        key={i}
                                                    >
                                                        <FormControl>
                                                            <div
                                                                className={
                                                                    getResultColor(
                                                                        form,
                                                                        submitted,
                                                                        answer
                                                                    ) +
                                                                    " flex items-center space-x-2 p-2 rounded-full transition-colors"
                                                                }
                                                            >
                                                                <RadioGroupItem
                                                                    value={
                                                                        answer.answer
                                                                    }
                                                                    disabled={
                                                                        submitted
                                                                    }
                                                                    id={`answer-${i}`}
                                                                />
                                                                <Label
                                                                    htmlFor={`answer-${i}`}
                                                                >
                                                                    {
                                                                        answer.answer
                                                                    }
                                                                </Label>
                                                            </div>
                                                        </FormControl>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {submitted ? (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (results.length === 5) {
                                            setPage("results");
                                        } else {
                                            setQuestionIndex(questions);
                                        }
                                    }}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button type="submit">Submit</Button>
                            )}
                        </form>
                    </Form>
                </article>
            )}
        </div>
    );
}
