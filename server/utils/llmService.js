const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function summarizeTodos(todos) {
  if (!todos || todos.length === 0) {
    return "No pending to-do items to summarize.";
  }

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Summarize the following list of pending to-do items concisely and meaningfully. Focus on key actions and categories.

  To-do list:
  ${todos.map((todo, index) => `${index + 1}. ${todo}`).join('\n')}

  Summary:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    console.error("Gemini API Error Details:", error.details || error.message);
    return "Failed to generate summary due to an internal error.";
  }
}

module.exports = { summarizeTodos };