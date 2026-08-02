# 링크나무 설계 (2026-08-03)

## 개요

내 모든 링크를 한 페이지에 모아 두고 하나의 URL로 공유하는 Link-in-Bio 서비스. 방문자는 단일 페이지에서 프로필과 링크 카드 목록을 보고, 카드를 눌러 외부 링크로 이동한다. 링크별 클릭 수는 서버에 집계하되 화면에는 노출하지 않는다.

## 범위

**포함**
- 프로필 표시: 원형 프로필 사진, 이름, 한 줄 소개
- 링크 카드 목록: 세로 1단, 클릭 시 외부 링크로 이동
- 링크별 클릭 수 집계 (MongoDB)
- 모바일 우선 반응형

**제외**
- 관리자/편집 화면 — 링크 수정은 설정 파일 커밋으로 처리
- 로그인, 다중 사용자, 테마 커스터마이징
- 클릭 수의 방문자 노출

## 아키텍처

```
src/config/profile.ts         프로필 + 링크 배열 (단일 진실 공급원), 타입 정의
src/components/
  ProfileHeader.tsx           사진 · 이름 · 소개
  LinkCard.tsx                카드 1개, 클릭 집계 발신 ('use client')
  LinkList.tsx                카드 목록
src/app/page.tsx              단일 페이지, config를 읽어 정적 렌더
src/app/api/clicks/route.ts   POST { id } → 카운트 +1
src/lib/mongodb.ts            연결 캐싱, URI 없으면 null 반환
public/profile.svg            프로필 플레이스홀더 이미지
```

각 단위의 책임 경계:
- `config/profile.ts`는 데이터만 안다. 렌더링·DB를 모른다.
- `components/*`는 props로 받은 데이터만 렌더한다. config를 직접 import하지 않는다.
- `lib/mongodb.ts`는 연결만 책임진다. 도메인 로직 없음.
- `api/clicks`는 집계만 한다. 링크 이동에 관여하지 않는다.

## 데이터 흐름

1. `page.tsx`가 `config/profile.ts`를 읽어 정적으로 렌더한다. DB 조회 없음.
2. 방문자가 카드를 클릭한다. 카드는 실제 목적지를 가리키는 `<a href>`이므로 브라우저가 정상적으로 이동시킨다.
3. 이동과 병행해 `navigator.sendBeacon('/api/clicks', { id })`를 발신한다 (실패해도 무시).
4. `/api/clicks`는 `clicks` 컬렉션에 `{ _id: linkId }` 문서를 `$inc: { count: 1 }` 로 upsert 한다.

### 클릭 집계 방식 선택 근거

`sendBeacon` + 실제 `href` 방식을 택했다. 링크가 진짜 URL을 가리키므로 우클릭·새 탭·링크 미리보기·접근성이 모두 정상 동작하고, 집계 경로의 어떤 실패도 링크 이동을 막지 못한다. 트레이드오프는 비콘 유실 시 카운트가 실제보다 조금 적게 잡힐 수 있다는 점이며, 이 서비스의 용도에서는 허용 가능하다.

대안으로 검토한 `/go/[id]` 서버 리다이렉트는 카운트가 정확하지만 링크 hover 시 내부 URL이 노출되고 DB 장애가 이동 자체를 막는다. Server Action 방식은 JS가 없으면 링크가 죽어 부적합하다.

## 데이터 모델

```ts
type Link = {
  id: string      // 안정적인 슬러그, 클릭 집계의 키
  label: string
  url: string
  description?: string
}

type Profile = {
  name: string
  tagline: string
  avatar: string  // public/ 기준 경로
  links: Link[]
}
```

MongoDB `clicks` 컬렉션: `{ _id: <link.id>, count: number, updatedAt: Date }`

## 에러 처리

집계는 전부 fire-and-forget이다.

- `MONGODB_URI`가 없으면 `lib/mongodb.ts`가 `null`을 반환하고 API 라우트는 204를 반환한다. 개발·프리뷰 환경에서 DB 없이도 정상 동작한다.
- DB 연결/쓰기 실패는 서버 로그에만 남기고 204를 반환한다.
- 잘못된 body나 알 수 없는 링크 id는 400으로 거절한다.
- 클라이언트는 응답을 확인하지 않는다.

## UI

와이어프레임을 따른 모바일 우선 세로 1단 레이아웃. 원형 프로필 사진 → 이름 → 한 줄 소개 → 라운드 카드 목록. Tailwind로 구현하고 `max-w-md mx-auto`를 적용해 데스크톱에서도 중앙 정렬된 좁은 칼럼을 유지한다. 카드는 hover/active 상태와 키보드 포커스 링을 가진다.

## 검증

- `npm run build`가 경고 없이 통과한다.
- 개발 서버에서 카드 클릭 시 목적지로 이동한다.
- `MONGODB_URI`가 없는 상태에서 클릭해도 콘솔 에러가 발생하지 않는다.
- 좁은 뷰포트와 데스크톱 폭 양쪽에서 레이아웃이 깨지지 않는다.

## 전제

- 프로필 초기값은 와이어프레임의 "홍길동 / 세계 최강의 바이브 코더"와 더미 링크 4개이며 이후 교체한다.
- 프로필 사진은 단색 플레이스홀더로 시작한다.
- Next.js 16 App Router, TypeScript, Tailwind, ESLint 구성을 현재 디렉터리에 스캐폴딩하며 기존 `CLAUDE.md` · `PRD.md` · `wireframe.png`는 보존한다.
