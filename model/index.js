`use strict`;

export const getResponseFromOpenAI = async (questionFromSpeechAPI) => {

 
  const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
    prompt:'WHat is 2+2',
    max_tokens: 60
  }, {
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json'
    }
  });
  
  return response.data.choices[0].text.trim();



};

export const getResponseFromSpeechAPI = () => {
  return "This is a hard coded response from the speech API";
};
