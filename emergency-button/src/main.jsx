import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './home.jsx'
import Footer, { footerItems } from './assets/footer.jsx'
import Maps from './Maps.jsx'

function getCurrentRoute() {
  const path = window.location.pathname
  const knownRoutes = footerItems.map((item) => item.href)
  return knownRoutes.includes(path) ? path : '/'
}

function PageShell({ title, description }) {
  return (
    <main className="page-shell">
      <section id="center">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
    </main>
  )
}

function Router() {
  const [route, setRoute] = useState(getCurrentRoute)

  useEffect(() => {
    const onPopstate = () => setRoute(getCurrentRoute())
    window.addEventListener('popstate', onPopstate)
    return () => window.removeEventListener('popstate', onPopstate)
  }, [])

  const page = useMemo(() => {
    switch (route) {
      case '/alerts':
        return <PageShell title="Alerts" description="View emergency alerts and notifications." />
      case '/map':
        return <Maps />
      case '/guide':
        return <PageShell title="Guide" description="Access step-by-step emergency procedures." />
      case '/profile':
        return <PageShell title="Profile" description="Manage your contact details and emergency preferences." />
      default:
        return <Home />
    }
  }, [route])

  return (
    <>
      {page}
      <Footer />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
