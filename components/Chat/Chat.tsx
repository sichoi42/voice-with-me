import { Conversation, KeyValuePair, Message, OpenAIModel } from '@/types';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import { ModelSelect } from './ModelSelect';
import { Regenerate } from './Regenerate';
import { SystemPrompt } from './SystemPrompt';

interface Props {
  conversation: Conversation;
  models: OpenAIModel[];
  apiKey: string;
  isUsingEnv: boolean;
  messageIsStreaming: boolean;
  modelError: boolean;
  messageError: boolean;
  loading: boolean;
  lightMode: 'light' | 'dark';
  onSend: (message: Message, isResend: boolean) => void;
  onSendAudio: (audioFile: FormData) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  onAcceptEnv: (accept: boolean) => void;
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat: FC<Props> = ({
  conversation,
  models,
  apiKey,
  isUsingEnv,
  messageIsStreaming,
  modelError,
  messageError,
  loading,
  lightMode,
  onSend,
  onSendAudio,
  onUpdateConversation,
  onAcceptEnv,
  stopConversationRef,
}) => {
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mikeRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    if (autoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const bottomTolerance = 30;

      if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
        setAutoScrollEnabled(false);
      } else {
        setAutoScrollEnabled(true);
      }
    }
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'F1') {
        mikeRef.current?.focus();
      } else if (e.key === 'Escape') {
        window.speechSynthesis.cancel();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
    textareaRef.current?.focus();
  }, [conversation.messages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);

      return () => {
        chatContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="relative flex-1 overflow-none dark:bg-[#343541] bg-white">
      {!apiKey && !isUsingEnv ? (
        <div className="flex flex-col justify-center mx-auto h-full w-[300px] sm:w-[500px] space-y-6">
          <div className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
            OpenAI API Key Required
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400">
            Please set your OpenAI API key in the bottom left of the sidebar.
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400">
            - OR -
          </div>
          <button
            className="flex items-center justify-center mx-auto px-4 py-2 border border-transparent text-xs rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => onAcceptEnv(true)}
          >
            click if using a .env.local file
          </button>
        </div>
      ) : modelError ? (
        <div className="flex flex-col justify-center mx-auto h-full w-[300px] sm:w-[500px] space-y-6">
          <div className="text-center text-red-500">Error fetching models.</div>
          <div className="text-center text-red-500">
            Make sure your OpenAI API key is set in the bottom left of the
            sidebar or in a .env.local file and refresh.
          </div>
          <div className="text-center text-red-500">
            If you completed this step, OpenAI may be experiencing issues.
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-scroll max-h-full" ref={chatContainerRef}>
            {conversation.messages.length === 0 ? (
              <>
                <div className="flex flex-col mx-auto pt-12 space-y-10 w-[350px] sm:w-[600px]">
                  <div className="text-4xl font-semibold text-center text-gray-800 dark:text-gray-100">
                    {models.length === 0 ? 'Loading...' : 'Chatbot UI'}
                  </div>

                  {models.length > 0 && (
                    <div className="flex flex-col h-full space-y-4 border p-4 rounded border-neutral-500">
                      <ModelSelect
                        model={conversation.model}
                        models={models}
                        onModelChange={(model) =>
                          onUpdateConversation(conversation, {
                            key: 'model',
                            value: model,
                          })
                        }
                      />

                      <SystemPrompt
                        conversation={conversation}
                        onChangePrompt={(prompt) =>
                          onUpdateConversation(conversation, {
                            key: 'prompt',
                            value: prompt,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center py-2 text-neutral-500 bg-neutral-100 dark:bg-[#444654] dark:text-neutral-200 text-sm border border-b-neutral-300 dark:border-none">
                  Model: {conversation.model.name}
                </div>

                {conversation.messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    index={index}
                    message={message}
                    lightMode={lightMode}
                  />
                ))}

                {loading && <ChatLoader />}

                <div
                  className="bg-white dark:bg-[#343541] h-[162px]"
                  ref={messagesEndRef}
                />
              </>
            )}
          </div>

          {messageError ? (
            <Regenerate
              onRegenerate={() => {
                if (currentMessage) {
                  onSend(currentMessage, true);
                }
              }}
            />
          ) : (
            <ChatInput
              stopConversationRef={stopConversationRef}
              textareaRef={textareaRef}
              mikeRef={mikeRef}
              messageIsStreaming={messageIsStreaming}
              onSend={(message) => {
                setCurrentMessage(message);
                onSend(message, false);
              }}
              onSendAudio={onSendAudio}
              model={conversation.model}
            />
          )}
        </>
      )}
    </div>
  );
};
