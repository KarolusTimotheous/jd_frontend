export default function Header({ route, activeLaw, lawName, navigate }) {
  return (
    <header className="live-header">
      <div className="header-inner">
        <button
          className="brand-word"
          aria-label="정독 홈"
          onClick={() => navigate({ view: "today" })}
        >
          정독<span>JEONGDOK</span>
        </button>
        <nav aria-label="주요 메뉴">
          {[
            { view: "today", label: "오늘의 국회" },
            { view: "explore", label: "국회탐험" },
            { view: "notebook", label: "의원의 업무노트" },
          ].map((tab, i) => (
            <button
              key={tab.view}
              aria-current={route.view === tab.view ? "page" : undefined}
              onClick={() =>
                navigate({
                  view: tab.view,
                  law: tab.view === "today" ? undefined : activeLaw,
                  person: tab.view === "notebook" ? route.person : undefined,
                })
              }
            >
              <small>0{i + 1}</small>
              {tab.label}
            </button>
          ))}
        </nav>
        <span className="header-motto">정치의 맥락을 읽다</span>
      </div>
      {route.view !== "today" && (
        <div className="breadcrumb">
          <button onClick={() => navigate({ view: "today" })}>
            오늘의 국회
          </button>
          <span>›</span>
          <button onClick={() => navigate({ view: "explore", law: activeLaw })}>
            {lawName || "선택한 법률"}
          </button>
          <span>›</span>
          <span>
            {route.view === "explore" ? "맥락 탐험" : "업무노트와 나의 생각"}
          </span>
        </div>
      )}
    </header>
  )
}
