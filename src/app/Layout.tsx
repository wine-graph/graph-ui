import {NavLink, Outlet, useLocation} from "react-router-dom";
import {type FormEvent, useCallback, useEffect, useMemo, useState} from "react";
import {useAuth} from "../auth";
import {type NavLinkDef, resolveNavLinksByRole, toPath} from "./roleNavConfig.ts";
import {LogIn, Menu, Search, X} from "lucide-react";
import {likelyPathsForRole, prefetchPath, prefetchPaths} from "./routePrefetch.ts";

const linkClass = (isActive: boolean) =>
  [
    "mx-2 my-[2px] flex flex-col items-center justify-center rounded-[var(--radius-md)] h-14 text-[10px] uppercase tracking-[0.12em] transition-colors",
    isActive
      ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)] ring-accent"
      : "text-fg-muted hover:bg-[color:var(--color-muted)] hover:text-token",
  ].join(" ");

const Layout = () => {
  const {isAuthenticated, user, pos} = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const retailerId = useMemo(
    () => user?.user?.role.value === "retailer" ? user.user.role.id : pos.token?.merchantId,
    [user?.user?.role.id, user?.user?.role.value, pos.token?.merchantId]
  );

  const producerId = user?.user.role.value === "producer" ? user?.user.role.id : "";
  const role = user?.user.role.value;

  const links: NavLinkDef[] | undefined = useMemo(() => {
    if (role === "retailer" && retailerId) return resolveNavLinksByRole(role, retailerId);
    if (role === "producer" && producerId) return resolveNavLinksByRole(role, producerId);
    return resolveNavLinksByRole("visitor", user?.user.role.id ?? "");
  }, [retailerId, producerId, role, user?.user.role.id]);

  const profilePath: string = useMemo(() => {
    if (role === "retailer" && retailerId) return `/retailer/${retailerId}/profile`;
    if (role === "producer") return `/producer/${producerId}/profile`;
    return "/profile";
  }, [role, retailerId, producerId]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const navCandidates = (links ?? [])
      .map((l) => toPath(l))
      .filter((path) => path && path !== "#" && path !== location.pathname)
      .slice(0, 4);

    const roleCandidates = likelyPathsForRole({
      role,
      retailerId,
      producerId,
    }).filter((path) => path && path !== location.pathname);

    const candidates = Array.from(new Set([...roleCandidates, ...navCandidates])).slice(0, 6);
    if (candidates.length === 0) return;

    const warm = () => prefetchPaths(candidates);
    const ric = window.requestIdleCallback;
    if (ric) {
      const id = ric(warm, {timeout: 1200});
      return () => window.cancelIdleCallback?.(id);
    }

    const timeout = window.setTimeout(warm, 300);
    return () => window.clearTimeout(timeout);
  }, [links, location.pathname, producerId, retailerId, role]);

  return (
    <div className="min-h-screen flex flex-col bg-token text-token">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 surface-elevated px-3 py-2 rounded-[var(--radius-sm)]"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-[1200] border-b border-token bg-token/95 backdrop-blur-sm">
        <div className="accent-strip h-[2px] w-full" />
        <div className="h-14 flex items-center gap-3 px-3 sm:px-5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              aria-label="Open navigation"
              aria-controls="primary-navigation"
              aria-expanded={mobileOpen}
              className="sm:hidden inline-flex items-center justify-center tap-target border border-token rounded-[var(--radius-sm)]"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5"/>
            </button>

            <form
              role="search"
              aria-label="Global search"
              className="hidden sm:flex items-center h-11 border border-token rounded-[var(--radius-md)] panel-token overflow-hidden transition-[width] duration-200 ease-out w-14 focus-within:w-[38rem] hover:w-[38rem]"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="header-search" className="sr-only">Search</label>
              <Search className="w-5 h-5 mx-4 text-fg-muted" aria-hidden="true"/>
              <input
                id="header-search"
                type="search"
                placeholder="Search wines, producers, retailers..."
                className="flex-1 min-w-0 h-full bg-transparent placeholder:text-[color:var(--color-fg-muted)] focus:outline-none transition-all duration-200 px-0 opacity-0 w-0 focus:opacity-100 focus:px-2 focus:w-full"
              />
            </form>

            <MobileHeaderSearch/>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <NavLink
              to={isAuthenticated ? profilePath : "/profile"}
              title={isAuthenticated ? "Profile" : "Sign in"}
              aria-label={isAuthenticated ? "Profile" : "Sign in"}
              className="md:hidden inline-flex items-center justify-center tap-target border border-token rounded-[var(--radius-sm)]"
            >
              {isAuthenticated ? (
                user?.user?.picture ? (
                  <span className="w-8 h-8 inline-flex items-center justify-center rounded-full overflow-hidden border border-token" aria-hidden="true">
                    <img
                      src={user?.user.picture}
                      alt={user?.user.name ?? "Profile"}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </span>
                ) : (
                  <span className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-token text-[12px]">
                    {(user?.user?.name ?? "").slice(0, 1).toUpperCase() || "U"}
                  </span>
                )
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true"/>
              )}
            </NavLink>

            <NavLink to="/" className="flex items-center gap-2 min-w-0 pr-1" aria-label="Wine Graph home">
                    <img
                src="/wine_graph_logo_128x128.png"
                alt="Wine Graph"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
                loading="eager"
                decoding="async"
              />
              <span className="hidden sm:inline text-[11px] tracking-[0.18em] uppercase text-fg-muted">Wine Graph</span>
            </NavLink>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside
          className="hidden md:flex md:sticky md:top-14 md:h-[calc(100vh-56px)] md:self-start w-[5.25rem] shrink-0 border-r border-token panel-token flex-col justify-between"
          aria-label="Primary"
        >
          <nav id="primary-navigation" className="py-3">
            <ul className="flex flex-col gap-1">
              {links?.filter(l => l.title !== "Profile").map((nav, i) => {
                const Icon = nav.icon;
                return (
                  <li key={i}>
                    <NavLink
                      to={toPath(nav)}
                      title={nav.title}
                      aria-label={nav.title}
                      onMouseEnter={() => prefetchPath(toPath(nav))}
                      onFocus={() => prefetchPath(toPath(nav))}
                      className={({isActive}) => linkClass(isActive)}
                    >
                      <Icon className="w-5 h-5 mb-[3px]" aria-hidden="true"/>
                      <span>{nav.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="py-3">
            <ul>
              <li>
                <NavLink
                  to={isAuthenticated ? profilePath : "/profile"}
                  title={isAuthenticated ? "Profile" : "Sign in"}
                  aria-label={isAuthenticated ? "Profile" : "Sign in"}
                  onMouseEnter={() => prefetchPath(isAuthenticated ? profilePath : "/profile")}
                  onFocus={() => prefetchPath(isAuthenticated ? profilePath : "/profile")}
                  className={({isActive}) => linkClass(isActive)}
                >
                  {isAuthenticated ? (
                    user?.user?.picture ? (
                      <span className="w-8 h-8 inline-flex items-center justify-center rounded-full overflow-hidden border border-token" aria-hidden="true">
                        <img
                          src={user?.user.picture}
                          alt={user?.user.name ?? "Profile"}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </span>
                    ) : (
                      <span className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-token text-[12px]">
                        {(user?.user?.name ?? "").slice(0, 1).toUpperCase() || "U"}
                      </span>
                    )
                  ) : (
                    <LogIn className="w-5 h-5" aria-hidden="true"/>
                  )}
                  <span>{isAuthenticated ? "Profile" : "Sign in"}</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        <main id="main" className="flex-1 min-w-0">
          <div className="container-max py-6 sm:py-8">
            <Outlet/>
          </div>
        </main>
      </div>

      {mobileOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[1300] sm:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)}/>
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] panel-token border-r border-token shadow-xl p-3">
            <button
              className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded border border-token"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5"/>
            </button>
            <nav aria-label="Primary">
              <ul className="flex flex-col gap-1">
                {links?.map((nav, i) => (
                  <li key={i}>
                    <NavLink
                      to={toPath(nav)}
                      onClick={() => setMobileOpen(false)}
                      onMouseEnter={() => prefetchPath(toPath(nav))}
                      onFocus={() => prefetchPath(toPath(nav))}
                      className={({isActive}) =>
                        [
                          "block rounded-[var(--radius-sm)] px-3 py-2 text-sm",
                          isActive
                            ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)] ring-accent"
                            : "hover:bg-[color:var(--color-muted)]",
                        ].join(" ")
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

const MobileHeaderSearch = () => {
  const [open, setOpen] = useState(false);

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
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
        <div className="fixed inset-x-0 top-14 z-[1250] px-3 py-2 bg-token border-b border-token">
          <form
            role="search"
            aria-label="Global search"
            className="flex items-center border border-token rounded-[var(--radius-sm)] panel-token overflow-hidden"
            onSubmit={onSubmit}
          >
            <label htmlFor="mobile-header-search" className="sr-only">Search</label>
            <div className="px-3 py-2 border-r border-token">
              <Search className="w-4 h-4" aria-hidden="true"/>
            </div>
            <input
              id="mobile-header-search"
              type="search"
              autoFocus
              placeholder="Search wines, producers, retailers..."
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

export default Layout;
