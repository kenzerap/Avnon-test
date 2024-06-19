export interface ChatGPTResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AnswerResponse[];
  usage: any;
}

export interface AnswerResponse {
  index: 0;
  message: {
    role: 'assistant';
    content: string;
  };
  logprobs: null;
  finish_reason: string;
}
