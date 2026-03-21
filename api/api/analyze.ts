import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { transactions } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    Analyze these transactions and give clear financial insights:
    ${JSON.stringify(transactions)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return res.status(200).json({
      text: response.text(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}