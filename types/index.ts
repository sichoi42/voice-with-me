export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'Default (GPT-3.5)',
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
  },
};

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatFolder {
  id: number;
  name: string;
}

export interface Conversation {
  id: number;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  folderId: number;
}

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
}

export interface KeyValuePair {
  key: string;
  value: any;
}

// keep track of local storage schema
export interface LocalStorage {
  apiKey: string;
  conversationHistory: Conversation[];
  selectedConversation: Conversation;
  theme: 'light' | 'dark';
  // added folders (3/23/23)
  folders: ChatFolder[];
}

// 정치, 경제, 사회, 생활/문화, IT/과학, 세계
export enum Category {
  POLITICS = '정치',
  ECONOMY = '경제',
  SOCIETY = '사회',
  LIFE = '생활/문화',
  IT = 'IT/과학',
  WORLD = '세계',
}

export interface ChatBodyWithNewsCategory {
  model: OpenAIModel;
  key: string;
  prompt: string;
  category: Category;
}

export interface NewsSummary {
  title: string;
  content: string;
  url: string;
  publisher: string;
  publishedAt: Date;
  writer: string;
  category: Category;
}
