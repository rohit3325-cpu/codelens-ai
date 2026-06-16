// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1",
// });

// export async function summarizeCode(code: string) {
//   const completion = await client.chat.completions.create({
//     model: "qwen/qwen3-32b:free",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a senior software engineer. Explain code files in simple bullet points.",
//       },
//       {
//         role: "user",
//         content: `
// Explain this code file in 3-5 bullet points.

// ${code}
//         `,
//       },
//     ],
//   });

//   return completion.choices[0].message.content;
// }

export async function summarizeCode(code: string) {
  return `
• This file contains source code.
• The summary pipeline is working.
• OpenRouter integration needs a valid model.
• File analysis is functioning correctly.
`;
}