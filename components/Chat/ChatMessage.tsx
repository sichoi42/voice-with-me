import { Message } from '@/types';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '../Markdown/CodeBlock';

interface Props {
  index: number;
  message: Message;
  lightMode: 'light' | 'dark';
}

export const ChatMessage: FC<Props> = ({ index, message, lightMode }) => {
  const speakMessage = (content: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'ko-KR';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div
      className={`group ${
        message.role === 'assistant'
          ? 'text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]'
          : 'text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-white dark:bg-[#343541]'
      }`}
      style={{ overflowWrap: 'anywhere' }}
      tabIndex={index + 1}
      // Add Mouse or Touch Event to Speak Message Content
      onMouseOver={() => {
        speakMessage(message.content, 1);
      }}
      onClick={() => {
        speakMessage(message.content, 1);
      }}
      onTouchEnd={(event) => {
        speakMessage(message.content, 1);
        event.preventDefault();
      }}
      onFocus={() => {
        speakMessage(message.content, 1);
      }}
      // Add Mouse or Touch Event to Stop Speaking
      onMouseLeave={() => {
        stopSpeaking();
      }}
      onBlur={() => {
        stopSpeaking();
      }}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <div className="font-bold min-w-[40px]">
          {message.role === 'assistant' ? 'AI:' : 'You:'}
        </div>

        <div className="prose dark:prose-invert mt-[-2px]">
          {message.role === 'user' ? (
            <div className="prose dark:prose-invert whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <CodeBlock
                      key={Math.random()}
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      lightMode={lightMode}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <table className="border-collapse border border-black dark:border-white py-1 px-3">
                      {children}
                    </table>
                  );
                },
                th({ children }) {
                  return (
                    <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-white">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="border border-black dark:border-white break-words py-1 px-3">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
