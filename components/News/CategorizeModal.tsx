import { Dispatch, FC, SetStateAction, useState } from 'react';
import { CategorySelectButton } from './CategorySelectButton';
import { Category } from '@/types';
import {
  IconBook,
  IconBrandCampaignmonitor,
  IconBriefcase,
  IconGlobe,
  IconHammer,
  IconUsers,
} from '@tabler/icons-react';

interface CategorizeModalProps {
  setCategorizeModalOpen: Dispatch<SetStateAction<boolean>>;
  onCategorySelect: (category: Category) => void;
}

export const CategorizeModal: FC<CategorizeModalProps> = ({
  setCategorizeModalOpen,
  onCategorySelect,
}) => {
  const handleButtonClick = async (category: Category) => {
    setCategorizeModalOpen(false);
    onCategorySelect(category);
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={() => setCategorizeModalOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                요약을 원하는 뉴스 기사 카테고리를 선택해주세요.
              </h3>
              <p className="text-sm text-gray-500">
                선택할 수 있는 카테고리는 다음과 같습니다.
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="flex items-center justify-center">
                  <IconHammer size={1} />
                  <CategorySelectButton
                    category={Category.POLITICS}
                    onButtonClick={handleButtonClick}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <IconBriefcase size={1} />
                  <CategorySelectButton
                    category={Category.ECONOMY}
                    onButtonClick={handleButtonClick}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <IconUsers size={1} />
                  <CategorySelectButton
                    category={Category.SOCIETY}
                    onButtonClick={handleButtonClick}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <IconBook size={1} />
                  <CategorySelectButton
                    category={Category.LIFE}
                    onButtonClick={handleButtonClick}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <IconBrandCampaignmonitor size={1} />
                  <CategorySelectButton
                    category={Category.IT}
                    onButtonClick={handleButtonClick}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <IconGlobe size={1} />
                  <CategorySelectButton
                    category={Category.WORLD}
                    onButtonClick={handleButtonClick}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {/* <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 dark:bg-[#444654] text-base font-medium text-white hover:dark:bg-[#343541] focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => {
                console.log(selectedCategory);
                setCategorizeModalOpen(false);
              }}
            >
              Categorize
            </button> */}

            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setCategorizeModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
