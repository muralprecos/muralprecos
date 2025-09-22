import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID!;

async function waitForRunCompletion(threadId: string, runId: string) {
  let run;
  do {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    run = await openai.beta.threads.runs.retrieve(threadId, runId);
  } while (run.status === "in_progress" || run.status === "queued");

  return run;
}

export async function POST(req: Request) {
  try {
    const { message, threadId: existingThreadId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "A propriedade 'message' é obrigatória." },
        { status: 400 }
      );
    }

    const threadId =
      existingThreadId ?? (await openai.beta.threads.create()).id;

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    const completedRun = await waitForRunCompletion(threadId, run.id);

    if (completedRun.status === "failed") {
      const errorMessage =
        completedRun.last_error?.message || "A execução falhou.";
      return NextResponse.json(
        { error: `Erro do assistente: ${errorMessage}` },
        { status: 500 }
      );
    }

    const messages = await openai.beta.threads.messages.list(threadId);

    const assistantMessage = messages.data.find((m) => m.role === "assistant");

    const reply =
      assistantMessage?.content?.[0]?.type === "text"
        ? assistantMessage.content[0].text.value
        : "Não foi possível obter uma resposta do assistente.";

    return NextResponse.json({ reply, threadId });
  } catch (error: any) {
    console.error("Erro no endpoint /api/ia/openai:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Erro interno ao processar sua solicitação." },
      { status: 500 }
    );
  }
}
