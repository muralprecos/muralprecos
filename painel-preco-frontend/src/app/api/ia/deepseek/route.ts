import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_DEFAULT_MODEL = 'deepseek-chat';

const DEEPSEEK_API_DEFAULT_TEMPERATURE = 1.0;
const DEEPSEEK_API_TOKEN = 'REDACTED-DEEPSEEK-KEY';
const DEEPSEEK_API_DEFAULT_PROMPT = 'Você deve agir como especialista em licitações e pregões públicos. Responder resumidamente (até 100 palavras) a pergunta. O resultado deve ser no formato para react-markdown.';

export async function POST(request: NextRequest, response: NextResponse) {
  
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
  }

  const model = DEEPSEEK_API_DEFAULT_MODEL;
  const temperature = DEEPSEEK_API_DEFAULT_TEMPERATURE;
  try {
    const req = await request.json();
    const { conversation_history } = req;
    
    const msgs = [{ role: 'system', content: DEEPSEEK_API_DEFAULT_PROMPT }].concat(conversation_history);
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_TOKEN}`,
      },
      body: JSON.stringify({
            model: model,
            messages: msgs,
            temperature: temperature,
        }),
    });
    
    const data = await response.json();
    if (response.status !== 200 || !data.choices || data.choices.length == 0 || !data.choices[0].message || !data.choices[0].message.content) {
      return NextResponse.json({ error: 'Ops, algo deu errado' }, { status: 500 });
    }

    return NextResponse.json({ data: data.choices[0].message.content }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar a requisição' }, { status: 500 });
  }
  
}