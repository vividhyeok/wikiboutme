# wikiboutme 문서 작성 가이드

이 프로젝트의 콘텐츠는 `/content` 디렉터리의 Markdown 파일로 관리한다.

## 새 문서 만들기

`/content/example.md`를 추가하면 `/wiki/example` 문서가 생성된다.

```md
---
title: 예시 문서
description: 문서 한 줄 설명
category: 기타
order: 10
updated: 2026-09-17
aliases:
  - 예시
  - sample
---

## 1. 개요

내용을 작성한다.
```

## 제목과 목차

`##`, `###`, `####` 제목은 문서의 자동 목차에 들어간다.

```md
## 1. 개요
### 1.1 세부 내용
#### 1.1.1 더 세부적인 내용
```

## 내부 링크

```md
[[projects]]
[[projects|프로젝트 목록]]
```

각각 `/wiki/projects`로 연결된다.

## 외부 링크

```md
[GitHub](https://github.com/vividhyeok)
```

## 표

```md
| 항목 | 내용 |
|---|---|
| 이름 | 김민혁 |
| 분야 | 개발 |
```

## 각주

```md
문장 내용[^1]

[^1]: 각주 설명
```

## 인용문

```md
> 인용문
```

## 코드 블록

````md
```python
print("hello")
```
````

코드 블록은 syntax highlighting을 지원한다.

## 기타 Markdown

- 굵게: `**내용**`
- 기울임: `*내용*`
- 취소선: `~~내용~~`
- 이미지: `![설명](이미지주소)`
- 목록: `- 항목`

## 문서 수정 흐름

사이트 문서의 `편집` 버튼을 누르면 해당 Markdown 파일의 GitHub 편집 화면으로 이동한다.

1. 사이트에서 문서 확인
2. `편집` 클릭
3. GitHub에서 Markdown 수정
4. `Commit changes`
5. Vercel 자동 배포
6. 사이트 반영

## 사이트 디자인 수정

`/content/_config.md`의 값을 변경한다.

예를 들어 메인 색상은 다음처럼 바꿀 수 있다.

```yaml
theme:
  accentColor: "#7c3aed"
```

사이트 이름, 설명, 색상, 본문 최대 폭, 검색/사이드바/분류/최근 수정/목차 표시 여부도 같은 파일에서 관리한다.

## 시스템 파일

`_config.md`, `_editing-guide.md`처럼 이름이 `_`로 시작하는 Markdown 파일은 시스템 파일이다. 일반 위키 문서 목록과 검색에서 제외된다.
