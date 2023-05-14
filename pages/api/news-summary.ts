import {
  ChatBodyWithNewsCategory,
  Message,
  NewsSummary,
  OpenAIModelID,
} from '@/types';
import { init, Tiktoken } from '@dqbd/tiktoken/lite/init';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { OpenAIStream } from '@/utils/server';
import { getNewsSummaryPrompt } from '@/utils/server/news.summary.prompt';
import { NextApiRequest } from 'next';
import { getRandomNews } from '../../prisma/news';

export const config = {
  runtime: 'edge',
};

async function parseStream(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let data = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    data += decoder.decode(value);
  }
  const { model, key, prompt, category } = JSON.parse(data.trim());
  return { model, key, prompt, category } as ChatBodyWithNewsCategory;
}

export default async function handler(req: NextApiRequest) {
  try {
    const buffer = req.body as ReadableStream;
    const { model, key, prompt, category } = await parseStream(buffer);
    console.log(model, key, prompt, category);
    const news = (await getRandomNews(category)) as NewsSummary;
    if (!news) {
      return new Response('No news found', { status: 404 });
    }
    console.log(news);

    const newsMessage: Message[] = [
      {
        role: 'user',
        content: getNewsSummaryPrompt(news),
      },
    ];

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );

    const tokenLimit = model.id === OpenAIModelID.GPT_4 ? 6000 : 3000;

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    const prompt_tokens = encoding.encode(promptToSend);

    let tokenCount = prompt_tokens.length;

    const tokens = encoding.encode(newsMessage[0].content);
    if (tokenCount + tokens.length > tokenLimit) {
      return new Response('Too long news summary', { status: 400 });
    }

    encoding.free();

    const stream = await OpenAIStream(model, promptToSend, key, newsMessage);

    return new Response(stream);
  } catch (error) {
    console.log(error);
    return new Response('Error', { status: 500 });
  }
}
