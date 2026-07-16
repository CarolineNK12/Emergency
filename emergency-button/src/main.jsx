import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./home.jsx";
import GuidePage from "./guide.jsx";
import Footer, { footerItems } from "./assets/footer.jsx";
import Maps from "./Maps.jsx";
import ProfilPage from "./Profil.jsx";
import Alerts from "./alerts.jsx";

function getCurrentRoute() {
  const path = window.location.pathname;
  const knownRoutes = footerItems.map((item) => item.href);
  return knownRoutes.includes(path) ? path : "/";
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
  );
}

function Router() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const onPopstate = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", onPopstate);
    return () => window.removeEventListener("popstate", onPopstate);
  }, []);

  const handleNavigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const page = useMemo(() => {
    switch (route) {
      case "/alerts":
        return <Alerts />;
      case "/map":
        return <Maps />;
      case "/guide":
        return <GuidePage onNavigate={handleNavigate} />;
      case "/profile":
        return <ProfilPage />;
      default:
        return <Home />;
    }
  }, [route]);

  return (
    <>
      {page}
      {/* 3. Pass handleNavigate directly into the Footer element */}
      <Footer onNavigate={handleNavigate} />
    </>
  );
}

let root = null;

function renderApp() {
  const container = document.getElementById("root");
  if (!container) {
    return;
  }

  if (!root) {
    root = createRoot(container);
  }

  root.render(
    <StrictMode>
      <Router />
    </StrictMode>,
  );
}

renderApp();

if (import.meta.hot) {
  import.meta.hot.accept();
}
