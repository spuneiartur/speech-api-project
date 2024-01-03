`use strict`;
import { OPENAI_TOKEN, OPENAI_API_URL } from "../constants.js";

export const getResponseFromOpenAI = async (questionFromSpeechAPI) => {
  console.log(OPENAI_API_URL, OPENAI_TOKEN);
  console.log("questionFromSpeechAPI", questionFromSpeechAPI);
  const response = await axios.post(
    `${OPENAI_API_URL}`,
    {
      prompt: "WHat is 2+2",
      max_tokens: 60,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_TOKEN}}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].text.trim();
};

export const getResponseFromSpeechAPI = () => {
  return "This is a hard coded response from the speech API";
};
getResponseFromOpenAI();
