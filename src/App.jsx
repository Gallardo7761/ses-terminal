import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router'
import { Footer, Ticker, TopBar } from '@/components/Layout.jsx'
import Hub from '@/pages/Hub.jsx'
import NotFound from '@/pages/NotFound.jsx'
import ServicePage from '@/pages/ServicePage.jsx'
import { paths } from '@/routes.js'
import { findPage, getPages } from '@/seo.js'
import '@/styles/app.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Hub />} />
        <Route path="services/:id/*" element={<ServicePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function Shell() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = (findPage(pathname) ?? getPages()[0]).title
  }, [pathname])

  return (
    <div className="hd-app">
      <Ticker />
      <TopBar />
      <main className="hd-main">
        <div className="hd-container">
          <Outlet />
        </div>
      </main>
      <Footer backTo={pathname !== paths.home ? paths.home : undefined} />
    </div>
  )
}
