import {NavLink, Outlet, useLocation} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useAuth} from "../auth";
import {type NavLinkDef, resolveNavLinksByRole, toPath} from "./roleNavConfig.ts";
import {Menu, X, LogIn, Search} from "lucide-react";
import logoUrl from "../public/winegraph.png";

const Layout = () => {
  const {isAuthenticated, user, pos} = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Retailer ID is NOT the Google user id. Prefer the POS merchant id when available,
  // otherwise fall back to the role.id (which represents the retailer/merchant id in our user model).
  const retailerId = useMemo(
    () => pos.token?.merchantId ?? user?.user?.role.id,
    [pos.token?.merchantId, user?.user?.role.id]
  );

  const producerId = user?.user.role.value === "producer" ? user?.user.role.id : "";
  const role = user?.user.role.value;

  const links: NavLinkDef[] | undefined = useMemo(() => {
    if (role === "retailer" && retailerId) {
      return resolveNavLinksByRole(role, retailerId);
    }
    if (role === "producer" && producerId) {
      return resolveNavLinksByRole(role, producerId);
    }
    return resolveNavLinksByRole("visitor", user?.user.role.id ?? "");
  }, [retailerId, producerId, role, user?.user.role.id]);

  // Dynamic profile path: route avatar to the correct profile page based on role
  const profilePath: string = useMemo(() => {
    if (role === "retailer" && retailerId) {
      return `/retailer/${retailerId}/profile`;
    }
    if (role === "producer") {
      return `/producer/${producerId}/profile`;
    }
    return "/profile";
  }, [role, retailerId, producerId]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Centralized auto-redirect: placeholder (user.id) -> definitive (role.id)
  // useEffect(() => {
  //   if (!isAuthenticated) return;
  //   if (attachInFlight) return; // avoid redirecting mid-attach
  //
  //   const googleId = user?.user?.id;
  //   const roleId = user?.user?.role?.id;
  //   if (!googleId || !roleId) return;
  //   if (googleId === roleId) return;
  //
  //   const path = location.pathname;
  //
  //   if (role === "producer") {
  //     const placeholder = `/producer/${googleId}/profile`;
  //     if (path === placeholder) {
  //       const target = `/producer/${roleId}/profile`;
  //       if (target !== path) navigate(target, { replace: true });
  //     }
  //   }
  //
  //   if (role === "retailer") {
  //     const placeholder = `/retailer/${googleId}/profile`;
  //     if (path === placeholder) {
  //       const target = `/retailer/${roleId}/profile`;
  //       if (target !== path) navigate(target, { replace: true });
  //     }
  //   }
  // }, [isAuthenticated, attachInFlight, role, user?.user?.id, user?.user?.role?.id, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-token text-token">
      {/* Skip link */}
      <a href="#main"
         className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 panel-token px-3 py-2 rounded-[var(--radius-sm)] border border-token">Skip
        to main content</a>

      {/* Slim header: left-side expanding search, logo on the right */}
      <header className="sticky top-0 z-[1200] border-b border-token bg-token">
        <div className="h-12 flex items-center gap-3 px-3 sm:px-4">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              aria-label="Open navigation"
              aria-controls="primary-navigation"
              aria-expanded={mobileOpen}
              className="sm:hidden inline-flex items-center justify-center tap-target border border-token rounded-[var(--radius-sm)]"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6"/>
            </button>
            {/* Desktop (sm+): icon-only until hover/focus, then expands */}
            <form
              role="search"
              aria-label="Global search"
              className="hidden sm:flex items-center h-10 border border-token rounded-[var(--radius-sm)] panel-token overflow-hidden transition-[width] duration-200 ease-out w-12 focus-within:w-96 hover:w-96"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="header-search" className="sr-only">Search</label>
              <Search className="w-6 h-6 mx-3" aria-hidden="true"/>
              <input
                id="header-search"
                type="search"
                placeholder="Search wines, producers, retailers…"
                className="flex-1 min-w-0 h-full bg-transparent placeholder:text-[color:var(--color-fg-muted)] focus:outline-none transition-all duration-200 px-0 opacity-0 w-0 focus:opacity-100 focus:px-2 focus:w-full"
              />
            </form>

            {/* Mobile (<sm): icon button opens a compact search bar */}
            <MobileHeaderSearch/>
          </div>
          {/* Right: profile/sign-in (mobile) + logo */}
          <div className="ml-auto flex items-center gap-2">
            {/* Mobile/sm-only: show profile/avatar since left rail is hidden */}
            <NavLink
              to={isAuthenticated ? profilePath : "/profile"}
              title={isAuthenticated ? "Profile" : "Sign in"}
              aria-label={isAuthenticated ? "Profile" : "Sign in"}
              className="md:hidden inline-flex items-center justify-center tap-target border border-token rounded-[var(--radius-sm)]"
            >
              {isAuthenticated ? (
                user?.user?.picture ? (
                  <span
                    className="w-8 h-8 inline-flex items-center justify-center rounded-full overflow-hidden border border-token"
                    aria-hidden="true">
                    <img
                      src={user?.user.picture}
                      alt={user?.user.name ?? "Profile"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </span>
                ) : (
                  <span
                    className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-token text-[12px]">
                    {(user?.user?.name ?? "").slice(0, 1).toUpperCase() || "U"}
                  </span>
                )
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true"/>
              )}
              <span className="sr-only">{isAuthenticated ? "Profile" : "Sign in"}</span>
            </NavLink>

            <NavLink to="/" className="flex items-center gap-2 min-w-0" aria-label="Wine Graph home">
              <img
                src={logoUrl}
                alt="Wine Graph"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                loading="eager"
                decoding="async"
              />
            </NavLink>
          </div>

        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar (md+) — icon-only rail (stickies under the 48px header) */}
        <aside
          className="hidden md:flex md:sticky md:top-12 md:h-[calc(100vh-48px)] md:self-start w-16 shrink-0 border-r border-token panel-token flex-col justify-between"
          aria-label="Primary"
        >
          <nav id="primary-navigation" className="py-2">
            <ul className="flex flex-col gap-1">
              {links?.filter(l => l.title !== "Profile").map((nav, i) => {
                const Icon = nav.icon;
                return (
                  <li key={i}>
                    <NavLink
                      to={toPath(nav)}
                      title={nav.title}
                      aria-label={nav.title}
                      className={({isActive}) =>
                        `mx-2 my-[2px] flex-center rounded-[var(--radius-sm)] h-11 ${isActive ? "bg-[color:var(--color-muted)]" : "hover:bg-[color:var(--color-muted)]"}`
                      }
                    >
                      {/* Icon only; keep text for screen readers */}
                      <Icon className="w-5 h-5" aria-hidden="true"/>
                      <span className="sr-only">{nav.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
          {/* Bottom: profile/sign-in moved to left nav */}
          <div className="py-2">
            <ul>
              <li>
                <NavLink
                  to={isAuthenticated ? profilePath : "/profile"}
                  title={isAuthenticated ? "Profile" : "Sign in"}
                  aria-label={isAuthenticated ? "Profile" : "Sign in"}
                  className={({isActive}) =>
                    `mx-2 my-[2px] flex-center rounded-[var(--radius-sm)] h-11 ${isActive ? "bg-[color:var(--color-muted)]" : "hover:bg-[color:var(--color-muted)]"}`
                  }
                >
                  {isAuthenticated ? (
                    user?.user?.picture ? (
                      <span
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full overflow-hidden border border-token"
                        aria-hidden="true">
                        <img
                          src={user?.user.picture}
                          alt={user?.user.name ?? "Profile"}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </span>
                    ) : (
                      <span
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-token text-[12px]">
                        {(user?.user?.name ?? "").slice(0, 1).toUpperCase() || "U"}
                      </span>
                    )
                  ) : (
                    <LogIn className="w-5 h-5" aria-hidden="true"/>
                  )}
                  <span className="sr-only">{isAuthenticated ? "Profile" : "Sign in"}</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main id="main" className="flex-1 min-w-0">
          <div className="container-max py-4">

            {/* Main data region for pages (tables/charts/lists) */}
            <div>
              <Outlet/>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[1300] sm:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)}/>
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] panel-token border-r border-token shadow-xl p-2">
            <button
              className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded border border-token"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5"/>
            </button>
            <nav aria-label="Primary">
              <ul className="flex flex-col">
                {links?.map((nav, i) => (
                  <li key={i}>
                    <NavLink
                      to={toPath(nav)}
                      onClick={() => setMobileOpen(false)}
                      className={({isActive}) =>
                        `block rounded px-3 py-2 ${isActive ? "bg-[color:var(--color-muted)]" : "hover:bg-[color:var(--color-muted)]"}`
                      }
                    >
                      {nav.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Layout;

// --- Local mobile search component (keeps changes contained) ---
import {useCallback} from "react";

const MobileHeaderSearch = () => {
  const [open, setOpen] = useState(false);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
  }, []);

  return (
    <div className="sm:hidden">
      <button
        aria-label="Search"
        className="inline-flex items-center justify-center tap-target border border-token rounded-[var(--radius-sm)]"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5"/>
      </button>
      {open && (
        <div className="fixed inset-x-0 top-11 z-[1250] px-3 py-2 bg-token border-b border-token">
          <form role="search" aria-label="Global search"
                className="flex items-center border border-token rounded-[var(--radius-sm)] panel-token overflow-hidden"
                onSubmit={onSubmit}>
            <label htmlFor="mobile-header-search" className="sr-only">Search</label>
            <div className="px-3 py-2 border-r border-token">
              <Search className="w-4 h-4" aria-hidden="true"/>
            </div>
            <input
              id="mobile-header-search"
              type="search"
              autoFocus
              placeholder="Search wines, producers, retailers…"
              className="flex-1 min-w-0 px-3 py-2 bg-transparent placeholder:text-[color:var(--color-fg-muted)] focus:outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              className="px-3 py-2 border-l border-token"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4"/>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
