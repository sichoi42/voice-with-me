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
        onClick={() => onButtonClick(category)}
        type="button"
        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        {icon}
        <span className="block text-sm whitespace-normal leading-snug line-clamp-2">
          {category}
        </span>
      </button>
    </div>
  );
};
