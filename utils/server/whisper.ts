import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

export const whisperRecognize = async (audioUrl: any) => {
  const openai = new OpenAIApi(configuration);
  const stream = fs.createReadStream(audioUrl) as any;
  const resp = await openai.createTranscription(
    stream,
    'whisper-1',
    undefined,
    undefined,
    0,
    'ko',
  );

  return resp?.data?.text;
};
