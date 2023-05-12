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
  뉴스 내용과 관련해서 미래에 어떤 사건이 일어날 것임이 담겨있다면, 요약에 꼭 포함시켜줘. (구체적인 시간까지)

  추가로 답변은 내가 했던 것처럼 반말로 해줘.
  답변의 시작은 이런 형태로 해줘: 오늘 xx시에 ${category} 분야에 올라온 뉴스야. (xx시는 해당 뉴스가 작성된 시간이야. 작성 시간은 아래 기사 내용 상단 부분에 있어.)
  답변의 끝에는 꼭 원본 뉴스 기사의 링크를 포함시켜줘.
  """
  기사 제목: ${title}
  작성일: ${publishedAt}
  신문사: ${publisher}
  작성자: ${writer}
  기사 본문 내용: ${content}
  기사 링크: ${url}
  """
  `;
};
