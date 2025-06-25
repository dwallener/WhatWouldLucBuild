// src/lib/llmClient.ts
export async function autofillTask(prompt: string): Promise<string> {
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
  const deployment = import.meta.env.VITE_AZURE_DEPLOYMENT_NAME;
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
  const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  console.log("GPT response:", data);

  return data?.choices?.[0]?.message?.content ?? "No response";
}

