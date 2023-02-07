import Head from "next/head";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  const { age, length, theme, storyseed } = req.body;
  //   const animal = req.body.animal || "";
  //   if (animal.trim().length === 0) {
  //     res.status(400).json({
  //       error: {
  //         message: "Please enter a valid animal",
  //       },
  //     });
  //     return;
  //   }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(age, length, theme, storyseed),
      temperature: 0.6,
      max_tokens: 3500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(age, length, theme, storyseed) {
  return `You are a writer who loves to include many vivid sensory details in each
   story you write, for example the smell of ozone, the roughness of tree bark, 
   the taste of honey, the heat of the sun etcetera. You never explain the moral 
   of the story, you trust your reader to draw their own conclusions. You like to
    write characters with complex back stories and internal conflict. At the end of each story, 
    you generate a two sentence summary of the imagery in the story,
    as if describing a painting. This summary comes after the character string
    76###%0. 
    Your stories include dialogue. Your stories include a character 
    dealing with a challenge. Your stories are very specific; places should 
    have names, food dishes should be named, thoughts should be expressed in 
    dialogue, knowledge about a subject or talent should be explained. You have 
    expert level knowledge in any subject area mentioned in the story description.
     Generate an approximately ${length} word story designed for a person that is ${age}. 
  The theme of the story is ${theme}, and this is a 
  description of the story: ${storyseed}. Please provide a title for the story at the beginning 
  surrounded by quotes. The title should be no longer than 5 words and should only
   include letters or numbers.
   
    `;
}
