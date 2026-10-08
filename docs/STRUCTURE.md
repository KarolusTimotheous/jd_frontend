# 구조 이전 안내

참고 프로젝트: `C:/Users/user/Documents/GitHub/final_project_front_end/src`

대상 저장소: `C:/Users/user/Documents/GitHub/jd_frontend`

샘플의 역할별 구조를 적용하며 정독의 화면과 기능은 유지했습니다. 현재 프로젝트는 React + JavaScript(JSX)로 구성합니다. 아래 이전 파일 열의 TypeScript 경로는 변경 이력을 설명하기 위한 것입니다.

| 이전 파일 | 현재 위치와 역할 |
| --- | --- |
| `src/App.tsx` | `app/router.jsx`, `layouts/JeongdokLayout.jsx`, `components/common/Header.jsx`, `Footer.jsx`, 조회·라우팅 훅 |
| `src/LivePages.tsx` | `pages/home`, `pages/explore`, `pages/notebook`, 공통·법률·의원 컴포넌트 |
| `src/live.ts` | `features/laws/{api,constants}.js`, `app/routes.js`, `utils/formatters.js`; 타입 전용 선언은 제거 |
| `src/PrivateNotes.tsx` | `features/notes/components/PrivateNotes.jsx`, `hooks/usePrivateNotes.js`, `storage.js` |
| `src/ui.tsx` | 현재 사용하는 UI를 `components/common`에 분리; 기존 예시 UI는 legacy 보관 |
| `src/index.css` | 진입 CSS와 `styles/tokens.css`, `global.css`, `jeongdok.css` |
| `server/argos.test.mjs` | `tests/argos.test.mjs` |
| 기존 가상 예시 화면 | `legacy/design-demo/src` |

화면 주소 `#/today`, `#/explore?law=…&node=…`, `#/lawmakers/…?law=…`와 개인 노트 저장 키를 유지했습니다. 메모 데이터는 브라우저에 있어 파일 복사 대상에 포함되지 않습니다.

샘플처럼 npm과 `package-lock.json`을 사용합니다. 라이브러리는 이전 실행본에서 검증된 버전으로 고정했습니다. 코드 형식과 기능 검증은 `npm run format`, `npm run check`로 실행합니다.

실행 흐름: `main.jsx` → `app/main.jsx` → `App.jsx` → `app/router.jsx` → `JeongdokLayout`과 각 페이지. 법률 조회는 `features/laws/hooks`, 개인 노트는 `features/notes/hooks`에서 관리합니다.

컴포넌트는 `.jsx`, 일반 로직·훅·브라우저 저장소·회귀 테스트는 `.js`, Node 서버는 기존 `.mjs` 형식을 사용합니다. `vite.config.js`에서 개발 서버와 공개 자료 API를 연결하고, `jsconfig.json`에서 편집기의 경로 별칭을 정의합니다. `tsconfig.json`, 타입 전용 파일, 직접 TypeScript 개발 의존성은 제거했습니다. `npm run check`는 테스트와 빌드를 실행합니다.
