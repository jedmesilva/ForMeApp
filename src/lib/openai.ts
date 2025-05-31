import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function processShoppingListText(text: string): Promise<{
  title: string;
  items: string[];
  category: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em análise de listas de compras. Analise o texto fornecido e extraia informações estruturadas. Responda sempre em JSON no formato: { 'title': 'título sugerido', 'items': ['item1', 'item2'], 'category': 'categoria principal' }"
        },
        {
          role: "user",
          content: `Analise esta solicitação de compras e organize os itens: ${text}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Lista de Compras",
      items: result.items || [],
      category: result.category || "Geral"
    };
  } catch (error) {
    throw new Error("Erro ao processar texto com IA");
  }
}

export async function processServiceRequest(text: string): Promise<{
  title: string;
  description: string;
  category: string;
  estimatedDuration: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em análise de solicitações de serviços. Analise o texto e estruture as informações. Responda sempre em JSON no formato: { 'title': 'título do serviço', 'description': 'descrição detalhada', 'category': 'categoria do serviço', 'estimatedDuration': 'tempo estimado' }"
        },
        {
          role: "user",
          content: `Analise esta solicitação de serviço: ${text}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Serviço Solicitado",
      description: result.description || text,
      category: result.category || "Outros",
      estimatedDuration: result.estimatedDuration || "A combinar"
    };
  } catch (error) {
    throw new Error("Erro ao processar solicitação com IA");
  }
}

export async function analyzeShoppingListImage(base64Image: string): Promise<{
  title: string;
  items: string[];
  notes: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analise esta imagem de uma lista de compras e extraia todos os itens visíveis. Responda em JSON no formato: { 'title': 'título sugerido', 'items': ['item1', 'item2'], 'notes': 'observações sobre a imagem' }"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: result.title || "Lista da Imagem",
      items: result.items || [],
      notes: result.notes || ""
    };
  } catch (error) {
    throw new Error("Erro ao analisar imagem com IA");
  }
}

export function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove o prefixo "data:image/...;base64,"
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}