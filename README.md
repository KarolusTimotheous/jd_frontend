# jd_frontend — 정독

정치의 맥락을 읽다. 아르고스 상위 20개 법률에서 이슈·입법 기록·발의 의원을 탐색하고, 의원과 법률에 대한 개인 노트를 남기는 React + JavaScript(JSX) 웹사이트입니다.

`final_project_front_end/src`의 역할별 구성(`app`, `pages`, `layouts`, `components`, `features`, `hooks`, `styles`, `utils`)을 참고해 정리했습니다. 컴포넌트는 JSX, 조회·라우팅·노트 로직은 JavaScript로 작성합니다. 바이올렛 디자인, 화면 주소와 노트 저장 형식은 유지했습니다.

## 실행

Node.js 22.18 이상이 필요합니다. Node.js 24 기준으로 확인했습니다.

```sh
npm ci
npm run dev
```

개발 주소: `http://127.0.0.1:5173/`

```sh
npm run check
npm start
```

`check`는 회귀 테스트, 화면과 데이터 서버 빌드를 순서대로 실행합니다. 빌드 후 `npm start` 또는 `start-preview.cmd`로 `http://127.0.0.1:4173/`에서 확인할 수 있습니다. 다른 프로그램이 포트를 사용하면 `node preview.mjs --port 4174`를 사용하세요.

## 디렉토리

```text
src/
  App.jsx                       # 앱 진입 컴포넌트
  main.jsx                      # Vite 진입점
  index.css                     # 전역 스타일 진입점
  app/
    main.jsx                    # React 초기화
    router.jsx                  # 페이지 연결
    routes.js                   # 기존 해시 주소 해석·생성
  layouts/
    JeongdokLayout.jsx           # 헤더·본문·푸터
  pages/
    home/HomePage.jsx           # 오늘의 국회
    explore/ExplorePage.jsx     # 국회탐험
    notebook/NotebookPage.jsx   # 의원의 업무노트
  components/common/           # 헤더, 푸터, 출처, 이미지 등
  features/
    laws/                      # 법률 API, 조회 훅, 의안 UI
    lawmakers/components/      # 의원 카드와 사진
    notes/                     # 개인 노트 저장·수정·복원, 훅, UI
  hooks/useHashRoute.js         # 화면 이동과 브라우저 뒤로 가기
  utils/formatters.js           # 날짜·국회 대수 표시
  styles/
    tokens.css                 # 색상·서체
    global.css                 # 공통 규칙
    jeongdok.css               # 정독 화면·반응형 스타일
server/                        # 공개 자료 조회·캐시·서버 빌드
data/                          # 아르고스 20개 법률의 초기 확인본
tests/                         # 자료 연결·주소·기존 개인 노트 회귀 테스트
public/                        # 이미지·파비콘
legacy/design-demo/            # 초기 가상 예시 보관본, 현재 앱에서 제외
docs/                          # 이전 구조와의 대응 및 데이터 운영 설명
```

폴더만 맞추기 위해 사용하지 않는 Context나 Mock을 추가하지 않았습니다. 현재 조회 상태는 기능별 훅에서 관리하고, 실제 자료의 실패 대비 확인본은 `data/`에 둡니다.

## JavaScript 구성

- 화면 컴포넌트: `.jsx`
- 기능 로직·훅·테스트: `.js`; Node 서버: `.mjs`
- 빌드 설정: `vite.config.js`; 편집기 경로 설정: `jsconfig.json`
- TypeScript 소스·타입 선언·직접 개발 의존성은 제거했습니다. 테스트와 빌드로 동작을 검증합니다.
- 초기 가상 예시 보관본도 JSX/JavaScript로 변환했으며 현재 앱에서는 불러오지 않습니다.

## 기능과 데이터

- 오늘의 국회: [아르고스 법률과 이슈](https://argos.nanet.go.kr/main/fusionanalysis/lawIssueGuest.do)의 **업데이트순 상위 20개**. 새로고침 시 재조회하고 원본 순서를 유지합니다.
- 국회탐험: 이슈·입법·개정 이력·발의 의원을 도형과 연결된 설명으로 표시합니다.
- 업무노트: [국회 의안정보](https://likms.assembly.go.kr/bill/main.do)에서 확인한 대표발의 의원과 해당 의안을 연결합니다. 과거 기록은 국회 대수를 표시합니다.
- 개인 노트: 의원과 법률별로 나누어 저장하고 임시 저장, 수정, 삭제·복원, 텍스트 내려받기를 지원합니다.

AI 설명은 공식 입법 기록과 구분합니다. 법률별로 최근 연결 의안 1건과 그 대안에 연결된 원안 최대 20건을 확인하며, 전체 의원 활동·공동발의자·역량 점수는 제공하지 않습니다. 정부·위원회 제안자를 개인 의원으로 추정하지 않습니다.

공개 페이지가 사용하는 조회 방식을 서버에서 호출하며, 해당 사이트의 형식이 변경되면 `server/argos.mjs`를 수정해야 합니다. 자세한 동작과 한계는 [데이터 운영 안내](docs/DATA.md)를 참고하세요.

## 메모 유지와 배포

메모는 기존과 같은 `jeongdok-private-v1:*` 키로 **현재 브라우저의 로컬 저장소**에 저장됩니다. 서버나 의원에게 보내지 않습니다. 저장소 경로를 옮겨도 같은 브라우저에서 같은 주소·포트로 접속하면 기존 노트를 계속 읽습니다. 주소나 포트가 바뀌면 브라우저 저장 공간도 달라집니다.

개발 서버와 실행 서버 모두 `/api/laws`와 `/api/laws/:id`를 제공합니다. `dist/`만 정적 호스팅하면 자료 조회가 동작하지 않으므로 Node 서버도 함께 운영해야 합니다. 현재 실행 설정은 로컬 주소에만 연결합니다.

Git에는 소스와 잠금 파일, 초기 공개 자료를 포함합니다. `node_modules/`, `dist/`, `server-bundle.mjs`, `.runtime/`, 환경변수·로그는 제외합니다.

기존 저장소의 `LICENSE`는 유지합니다. 공식 자료와 외부 이미지는 각 원출처의 이용 조건이 적용됩니다.
