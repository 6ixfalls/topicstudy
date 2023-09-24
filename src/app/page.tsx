"use client";
import {
    Form,
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionMarkIcon, TextAlignLeftIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRef } from "react";

const formSchema = z.object({
    topic: z.string().min(2, {
        message: "Topic must be at least 2 characters.",
    }),
    studyMode: z.enum(["passage", "trivia"]),
});

export default function Home() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    const formRef = useRef<HTMLFormElement>(null);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    ref={formRef}
                    className="space-y-8 w-96"
                >
                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Topic</FormLabel>
                                <FormControl>
                                    <Input placeholder="Physics" {...field} />
                                </FormControl>
                                <FormDescription>
                                    What topic are you studying?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button">Study</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    How do you want to study?
                                </DialogTitle>
                            </DialogHeader>
                            <FormField
                                control={form.control}
                                name="studyMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-row justify-between space-y-0"
                                            >
                                                <FormItem className="basis-0 flex-grow">
                                                    <FormLabel>
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="passage"
                                                                className="hidden peer"
                                                            />
                                                        </FormControl>
                                                        <Card className="w-full mr-2 h-full peer-aria-checked:border-slate-100 transition-colors">
                                                            <CardHeader className="p-4">
                                                                <CardTitle className="flex flex-row">
                                                                    <TextAlignLeftIcon className="text-slate-100 mr-2 h-4 w-4" />
                                                                    Passage +
                                                                    Trivia
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="text-slate-300 text-sm">
                                                                Read a 2
                                                                paragraph long
                                                                passage about
                                                                your topic and
                                                                answer 5
                                                                questions about
                                                                it.
                                                            </CardContent>
                                                        </Card>
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="basis-0 flex-grow">
                                                    <FormLabel>
                                                        <FormControl>
                                                            <RadioGroupItem
                                                                value="trivia"
                                                                className="hidden peer"
                                                            />
                                                        </FormControl>
                                                        <Card className="w-full ml-2 h-full peer-aria-checked:border-slate-100 transition-colors">
                                                            <CardHeader className="p-4">
                                                                <CardTitle className="flex flex-row">
                                                                    <QuestionMarkIcon className="text-slate-100 mr-2 h-4 w-4" />
                                                                    Trivia
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="text-slate-300 text-sm">
                                                                Answer 5
                                                                questions about
                                                                your topic.
                                                            </CardContent>
                                                        </Card>
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    onClick={() => {
                                        formRef.current?.requestSubmit();
                                    }}
                                >
                                    Start
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </main>
    );
}
