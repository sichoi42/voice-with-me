import { ChatBodyWithNewsCategory, Message, OpenAIModelID } from '@/types';
import { init, Tiktoken } from '@dqbd/tiktoken/lite/init';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';
import { OpenAIStream } from '@/utils/server';
import { getNewsSummary } from '@/utils/server/news.summary';
import { getNewsSummaryPrompt } from '@/utils/server/news.summary.prompt';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, key, prompt, category } =
      (await req.json()) as ChatBodyWithNewsCategory;

    const newsInfo = await getNewsSummary(category);
    const newsMessage: Message[] = [
      {
        role: 'user',
        content: getNewsSummaryPrompt(newsInfo),
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
};

export default handler;
