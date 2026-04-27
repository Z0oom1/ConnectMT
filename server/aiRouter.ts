import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { invokeLLM, Message } from "./_core/llm";

export const aiRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `Você é o ConnectMT, um assistente inteligente especializado em motocicletas. 
      Sua personalidade é técnica, porém amigável e direta. 
      Você ajuda o piloto com diagnósticos, dicas de manutenção e informações em tempo real.
      Mantenha as respostas concisas e úteis para alguém que pode estar pilotando ou prestes a pilotar.`;

      const messages: Message[] = [
        { role: "system", content: systemPrompt },
        ...input.messages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ];

      const result = await invokeLLM({
        messages,
      });

      const responseContent = result.choices[0].message.content;
      const textResponse = typeof responseContent === "string" 
        ? responseContent 
        : Array.isArray(responseContent) 
          ? responseContent.filter(c => c.type === "text").map(c => (c as any).text).join("")
          : "";

      return {
        message: textResponse,
      };
    }),

  diagnose: publicProcedure
    .input(
      z.object({
        sensorData: z.record(z.any()),
      })
    )
    .query(async ({ input }) => {
      const prompt = `Analise os seguintes dados dos sensores de uma motocicleta e forneça um diagnóstico rápido:
      ${JSON.stringify(input.sensorData, null, 2)}
      
      Responda em formato JSON com os campos:
      - status: "normal" | "warning" | "critical"
      - message: string (resumo do diagnóstico)
      - recommendations: string[] (lista de recomendações)`;

      const result = await invokeLLM({
        messages: [{ role: "user", content: prompt }],
        responseFormat: { type: "json_object" }
      });

      const responseContent = result.choices[0].message.content;
      const textResponse = typeof responseContent === "string" 
        ? responseContent 
        : "";

      return JSON.parse(textResponse);
    }),
});
