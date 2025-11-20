import {NavLink, Outlet, useLocation} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useAuth} from "../auth/authContext";
import {type NavLinkDef, resolveNavLinksByRole, toPath} from "../nav/roleNavConfig";
import {Menu, X, LogIn, Search} from "lucide-react";

const Layout = () => {
  const {role, isAuthenticated, user} = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links: NavLinkDef[] = useMemo(
    () => resolveNavLinksByRole(role, user?.user?.role.id),
    [role, user?.user?.role.id]
  );

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Top Nav (logo appears only once here) */}
      <header className="sticky top-0 z-[1200] border-b border-token bg-token">
        <div className="container-max h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              className="sm:hidden inline-flex items-center justify-center tap-target border-2 border-token rounded-[var(--radius-sm)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6"/>
              ) : (
                <Menu className="w-6 h-6"/>
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-3">
              {/*<img  alt="Wine Graph" className="h-8 w-auto" />*/}
            </NavLink>
          </div>

          {/* Desktop search */}
          <form role="search" aria-label="Site" className="hidden md:flex items-center max-w-md flex-1 mx-4">
            <label htmlFor="site-search" className="sr-only">Search</label>
            <div className="flex w-full">
              <input
                id="site-search"
                type="search"
                placeholder="Search wines, regions, producers"
                className="flex-1 border-2 border-token rounded-l-[var(--radius-sm)] px-3 py-2 bg-token placeholder:text-[color:var(--color-fg-muted)] focus:outline-none focus-accent"
              />
              <button type="submit" aria-label="Search" className="border-2 border-l-0 border-token rounded-r-[var(--radius-sm)] px-3 tap-target focus-accent">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            {links.map((nav, i) => (
              <NavLink
                key={i}
                to={toPath(nav)}
                className={({isActive}) =>
                  `uppercase tracking-wide px-1 border-b-2 ${isActive ? "border-[color:var(--color-primary)]" : "border-transparent hover:border-[color:var(--color-border)] text-[color:var(--color-fg)]"}`
                }
              >
                {nav.title}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <NavLink to="/profile">
                <button className="btn-minimal">
                  <LogIn aria-hidden="true" />
                </button>
              </NavLink>
            ) : (
              <button
                className="size-9 rounded-full border border-token overflow-hidden"
                aria-label="User menu"
              >
                {user?.user?.picture ? (
                  <img src={user.user.picture} alt={user?.user?.name || "User"} className="w-full h-full object-cover"/>
                ) : (
                  <span className="text-sm">
                    {user?.user?.name?.charAt(0)?.toUpperCase() || user?.user?.email?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div id="mobile-menu" className="sm:hidden border-t border-token bg-token">
            <div className="container-max py-3">
              <ul className="flex flex-col gap-2">
                {links.map((nav, i) => (
                  <li key={i}>
                    <NavLink
                      to={toPath(nav)}
                      onClick={() => setMobileOpen(false)}
                      className={({isActive}) =>
                        `block py-3 px-1 border-b-2 ${isActive ? "border-[color:var(--color-primary)]" : "border-transparent"}`
                      }
                    >
                      {nav.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container-max py-4">
          <Outlet/>
        </div>
      </main>

      {/* Footer: centered simple tagline (no nav, no brand text) */}
      {/*<footer className="mt-auto border-t border-token">*/}
      {/*  <div className="container-max py-6 text-center text-[13px] text-[color:var(--color-fg-muted)]">*/}
      {/*    <span className="uppercase tracking-wide">Welcome to Wine Graph | Discover boldly. Drink wisely.</span>*/}
      {/*  </div>*/}
      {/*</footer>*/}
    </div>
  );
};

export default Layout;
