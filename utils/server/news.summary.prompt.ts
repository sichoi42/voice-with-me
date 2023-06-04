import { NewsSummary } from '@/types';

export const getNewsSummaryPrompt = (newsInfo: NewsSummary) => {
  const { title, content, url, publisher, publishedAt, writer, category } =
    newsInfo;

  return `
  """와 """ 사이에 있는 건 오늘자 뉴스 기사야. 해당 뉴스 기사를 요약해줘. 단, 아래 지시사항을 참고해줘.
  1. 입력 언어: 한국어
  2. 출력 언어: 한국어
  3. 스타일: 간결하게
  4. 독자 대상: 친구
  5. 답변 길이: utf-8 인코딩 기준 최대 1500바이트
  6. 기사 카테고리: ${category}
  7. 추가 지시사항:
    - 답변은 내가 했던 것처럼 반말로 해줘.
    - 답변의 시작을 아래 내용을 고려하여 일관된 형식으로 작성해줘.
      - 만약 작성일이 오늘 날짜와 같다면: 오늘 ${publishedAt.getHours()}시에 ${category} 분야에 올라온 뉴스야.
      - 만약 작성일이 오늘 날짜보다 하루 전이라면: 어제 ${publishedAt.getHours()}시에 ${category} 분야에 올라온 뉴스야.
      - 그 외: ${publishedAt.getDate()}일 ${publishedAt.getHours()}시에 ${category} 분야에 올라온 뉴스야.
    - 답변의 끝에는 꼭 원본 뉴스 기사의 링크를 포함시켜줘.
  """
  기사 제목: ${title}
  작성일: ${publishedAt}
  신문사: ${publisher}
  작성자: ${writer}
  기사 본문 내용: ${content}
  기사 링크: ${url}
  """

  답변은 반말로 해야한다는 걸 잊지 말아줘.
  `;
};
