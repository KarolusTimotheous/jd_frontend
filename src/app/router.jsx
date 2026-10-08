import JeongdokLayout from "../layouts/JeongdokLayout"
import HomePage from "../pages/home/HomePage"
import ExplorePage from "../pages/explore/ExplorePage"
import NotebookPage from "../pages/notebook/NotebookPage"
import { useHashRoute } from "../hooks/useHashRoute"
import { useLawFeed } from "../features/laws/hooks/useLawFeed"
import { useLawDetail } from "../features/laws/hooks/useLawDetail"
export default function AppRouter() {
  const { route, navigate } = useHashRoute()
  const { feed, refreshing, error, refresh } = useLawFeed()
  const activeLaw = route.law || feed?.items[0]?.id
  const currentLaw = feed?.items.find((l) => l.id === activeLaw)
  const { detail, loadingDetail, detailError, retry } = useLawDetail(
    activeLaw,
    route.view === "today",
    feed?.fetchedAt,
  )
  const explore = (law = activeLaw || "") => navigate({ view: "explore", law })
  const notebook = (person) =>
    navigate({ view: "notebook", law: activeLaw, person })
  return (
    <JeongdokLayout
      route={route}
      activeLaw={activeLaw}
      lawName={currentLaw?.name || detail?.law.name}
      navigate={navigate}
    >
      {error && (
        <div className="page-wrap pb-0">
          <div role="alert" className="notice">
            {error} {feed && "현재 화면은 이전에 불러온 목록입니다."}
            <button className="underline ml-3" onClick={refresh}>
              다시 시도
            </button>
          </div>
        </div>
      )}
      {!feed && !error && (
        <div className="loading-page" role="status">
          <div className="loading-mark">정독</div>
          <h1>오늘의 법률을 읽어오는 중</h1>
          <p>아르고스의 업데이트순 상위 20개를 확인하고 있어요.</p>
        </div>
      )}
      {feed && route.view === "today" && (
        <HomePage
          feed={feed}
          refreshing={refreshing}
          refresh={refresh}
          explore={explore}
        />
      )}
      {feed && route.view !== "today" && (
        <>
          {loadingDetail && (
            <div className="loading-page" role="status">
              <div className="loading-mark">↗</div>
              <h1>{currentLaw?.name || "선택한 법률"}</h1>
              <p>
                이슈와 의안, 공식 발의 기록을 연결하고 있어요.
                <br />
                처음 연결할 때는 조금 더 걸릴 수 있어요.
              </p>
            </div>
          )}
          {detailError && (
            <div className="page-wrap">
              <div role="alert" className="empty-state">
                {detailError}
                <div className="flex gap-4 justify-center mt-5">
                  <button className="primary-button" onClick={retry}>
                    다시 연결하기
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => navigate({ view: "today" })}
                  >
                    20개 법률 보기
                  </button>
                </div>
              </div>
            </div>
          )}
          {detail && route.view === "explore" && (
            <ExplorePage
              key={detail.law.id}
              detail={detail}
              node={route.node || "issue"}
              selectNode={(node) => navigate({ ...route, node }, false, true)}
              notebook={notebook}
            />
          )}
          {detail && route.view === "notebook" && (
            <NotebookPage
              key={detail.law.id + (route.person || "")}
              detail={detail}
              personId={route.person}
              notebook={notebook}
              explore={() => explore()}
            />
          )}
        </>
      )}
    </JeongdokLayout>
  )
}
