# wikiboutme

GitHub의 Markdown 파일을 콘텐츠 원본으로 사용하는 개인용 위키입니다. 나무위키처럼 문서를 탐색하는 경험을 참고하되, 콘텐츠 관리 방식은 최대한 단순하게 유지합니다.

## 핵심 구조

```text
/content
  _config.md          # 사이트 전역 설정
  _editing-guide.md   # Markdown 작성 가이드
  index.md            # 대문
  profile.md
  education.md
  projects.md
  ai-tools.md
  music.md
  preferences.md
```

`_`로 시작하는 Markdown 파일은 시스템 파일이라 일반 문서/검색/분류에서 제외됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run lint
npm run build
```

## 새 문서 추가

`content/example.md` 파일을 만듭니다.

```md
---
title: 예시 문서
description: 설명
category: 기타
order: 10
updated: 2026-09-17
aliases:
  - 예시
---

## 1. 개요

내용
```

커밋하면 `/wiki/example`에서 문서를 볼 수 있습니다.

## 내부 링크

```md
[[projects]]
[[projects|프로젝트 목록]]
```

## 사이트 설정

`content/_config.md`에서 사이트 이름, 설명, 색상, 본문 폭, 메뉴 표시 여부 등을 수정할 수 있습니다.

## GitHub에서 편집

각 문서의 `편집` 버튼은 대응하는 `content/*.md`의 GitHub 편집 화면으로 이동합니다. GitHub에서 커밋하면 Vercel의 Git 연동을 통해 자동 재배포할 수 있습니다.

## Vercel 배포

1. Vercel에서 `vividhyeok/wikiboutme` 저장소를 Import합니다.
2. Framework Preset은 Next.js를 선택합니다.
3. 기본 Build Command(`next build`) 그대로 배포합니다.
4. 이후 `main` 브랜치에 Markdown을 커밋하면 자동으로 다시 배포됩니다.

더 자세한 작성법은 [`content/_editing-guide.md`](content/_editing-guide.md)를 참고하세요.
