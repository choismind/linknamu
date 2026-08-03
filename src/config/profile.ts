export type Link = {
  /** 클릭 집계의 키. 한 번 정하면 바꾸지 않는다. */
  id: string;
  label: string;
  url: string;
  description?: string;
};

export type Profile = {
  name: string;
  tagline: string;
  /** public/ 기준 경로 또는 외부 이미지 URL */
  avatar: string;
  links: Link[];
};

export const profile: Profile = {
  name: "개발자",
  tagline: "플스택 개발자 | 연습용이에요",
  avatar: "https://placehold.co/150x150/green/white",
  links: [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/",
      description: "만들고 있는 것들",
    },
    {
      id: "blog",
      label: "블로그",
      url: "https://example.com/blog",
      description: "개발하며 배운 것들",
    },
    {
      id: "x",
      label: "X (트위터)",
      url: "https://x.com/",
    },
  ],
};
