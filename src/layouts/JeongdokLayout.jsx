import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
export default function JeongdokLayout({
  children,
  route,
  activeLaw,
  lawName,
  navigate,
}) {
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById("main-content")?.focus()
        }}
      >
        본문으로 바로가기
      </a>
      <Header
        route={route}
        activeLaw={activeLaw}
        lawName={lawName}
        navigate={navigate}
      />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
