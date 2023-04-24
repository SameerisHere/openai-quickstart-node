import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const book = req.body.book || '';
  if (book.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Enter A Book Below",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(book),
      max_tokens: 1000,
      temperature: 1,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(book) {
  const capitalizedbook =
    book[0].toUpperCase() + book.slice(1).toLowerCase();
  return `Respond with 3 book suggestions with different authors that are similar to a book the user gives

Book: The Alchemist by Paulo Coelho
  Suggestions: 
  1. Siddhartha by Herman Hesse
  2. The Little Prince by Antoine de Saint-Exupéry
  3. The Kite Runner by Khaled Hosseini
Book: The Hundred-Year-Old Man Who Climbed Out the Window and Disappeared by Jonas Jonasson
  Suggestions: 
  1. The Rosie Project by Graeme Simsion
  2. The Curious Incident of the Dog in the Night-Time by Mark Haddon
  3. The Little Old Lady Who Broke All the Rules by Catharina Ingelman-Sundberg
Suggestions: ${capitalizedbook}
Names:`;
}
