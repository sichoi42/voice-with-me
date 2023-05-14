import { Category } from '@/types';
import { FC } from 'react';
import {
  IconBook,
  IconBrandCampaignmonitor,
  IconBriefcase,
  IconGlobe,
  IconHammer,
  IconUsers,
} from '@tabler/icons-react';

interface CategorySelectButtonProps {
  category: Category;
  onButtonClick: (category: Category) => void;
}

export const CategorySelectButton: FC<CategorySelectButtonProps> = ({
  category,
  onButtonClick,
}) => {
  let icon = null;

  const speakMessage = (content: string, rate: number) => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'ko-KR';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  switch (category) {
    case Category.WORLD:
      icon = <IconGlobe size={20} />;
      break;
    case Category.ECONOMY:
      icon = <IconBriefcase size={20} />;
      break;
    case Category.SOCIETY:
      icon = <IconUsers size={20} />;
      break;
    case Category.LIFE:
      icon = <IconBook size={20} />;
      break;
    case Category.IT:
      icon = <IconBrandCampaignmonitor size={20} />;
      break;
    case Category.POLITICS:
      icon = <IconHammer size={20} />;
    default:
      break;
  }

  return (
    <div>
      <button
        onMouseOver={() => {
          if (category === Category.IT) {
            speakMessage(`아이티 과학`, 1);
          } else {
            speakMessage(category, 1);
          }
          setTimeout(() => {}, 2000);
        }}
        onFocus={() => {
          if (category === Category.IT) {
            speakMessage(`아이티 과학`, 1);
          } else {
            speakMessage(category, 1);
          }
          setTimeout(() => {}, 2000);
        }}
        onMouseLeave={stopSpeaking}
        onBlur={stopSpeaking}
        onClick={() => {
          stopSpeaking();
          if (category === Category.IT) {
            speakMessage(`아이티 과학 분야의 뉴스 요약을 시작합니다.`, 1);
          } else {
            speakMessage(`${category} 분야의 뉴스 요약을 시작합니다.`, 1);
          }
          onButtonClick(category);
        }}
        onTouchEnd={(event) => {
          if (category === Category.IT) {
            speakMessage(`아이티 과학 분야의 뉴스 요약을 시작합니다.`, 1);
          } else {
            speakMessage(`${category} 분야의 뉴스 요약을 시작합니다.`, 1);
          }
          onButtonClick(category);
          event.preventDefault();
        }}
        type="button"
        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm bg-[#444654] hover:bg-[#000000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500`}
      >
        {icon}
        <span className="block text-sm whitespace-normal leading-snug line-clamp-2">
          {category}
        </span>
      </button>
    </div>
  );
};
