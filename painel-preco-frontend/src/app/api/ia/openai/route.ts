import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { SYSTEM_PROMPT } from "@/lib/prompts/systemPrompt";

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: "Serviço de IA não está disponível no momento." },
        { status: 503 }
      );
    }

    let apiMessages: any[] = [];

    if (messages && Array.isArray(messages)) {
      // Filtra qualquer mensagem de sistema enviada pelo cliente para evitar duplicidade
      apiMessages = messages.filter((msg: any) => msg.role !== "system");
    } else if (message) {
      apiMessages = [{ role: "user", content: message }];
    } else {
      return NextResponse.json(
        { error: "A propriedade 'message' ou 'messages' é obrigatória." },
        { status: 400 }
      );
    }

    // Chamada à API de Chat Completions
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...apiMessages,
      ],
    });

    const reply =
      response.choices[0]?.message?.content ||
      "Não foi possível obter uma resposta do assistente.";

    return NextResponse.json({ reply });
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

