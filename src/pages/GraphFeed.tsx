import {Link} from "react-router-dom";
import {useAuth} from "../auth";

const GraphFeed = () => {
  const {isRetailer, isProducer} = useAuth();

  // Role-aware content (simple placeholders; data hooks will replace later)
  const youContent = (() => {
    if (isRetailer) {
      return {
        contribution: ["421 items synced from your POS"],
        gets: ["27 wines matched into the graph", "Shown in search near your locations"],
        actionLabel: "View inventory",
        actionHref: "/marketplace",
      };
    }
    if (isProducer) {
      return {
        contribution: ["18 wines with up-to-date data"],
        gets: ["Listed by 4 retailers", "Visible in 3 regions"],
        actionLabel: "View your wines",
        actionHref: "/explore",
      };
    }
    return {
      contribution: ["No wines viewed yet"],
      gets: ["Start exploring to improve suggestions for everyone"],
      actionLabel: "Browse wines",
      actionHref: "/explore",
    };
  })();

  return (
    <main className="container-max py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4">
      {/* Search + tagline */}
      <section>
        <div className="relative">
          <input
            type="text"
            placeholder="Search wines, producers, retailers, regions…"
            className="w-full bg-white border border-token rounded-[var(--radius-md)] text-[15px] px-4 py-3 shadow-sm outline-none focus-accent"
          />
        </div>
        <div className="text-center mt-3">
          <p className="text-[15px] text-muted">Everyone contributes. Everyone wins.</p>
          <p className="text-[13px] text-muted mt-1">Retailers sync inventory, producers refine data, and everyone gets
            a better map of wine.</p>
        </div>
      </section>

      {/* First row: snapshot + You in the graph */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 items-stretch gap-4 sm:gap-6">
        {/* You in the graph card */}
        <div className="panel-token border border-token rounded-[var(--radius-md)] p-4 sm:p-5 flex flex-col h-full w-full mt-4 md:mt-0">
          <h2 className="text-[18px] font-medium leading-tight">You in the graph</h2>
          <div className="mt-3 space-y-4">
            <div>
              <div className="text-label text-muted">Your contribution</div>
              <ul className="list-disc pl-5 mt-2 text-[15px] space-y-1">
                {youContent.contribution.map((line, i) => (
                  <li key={`c-${i}`}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-label text-muted">What you get</div>
              <ul className="list-disc pl-5 mt-2 text-[15px] space-y-1">
                {youContent.gets.map((line, i) => (
                  <li key={`g-${i}`}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link to={youContent.actionHref} className="btn btn-secondary focus-accent">
              {youContent.actionLabel}
            </Link>
          </div>
        </div>

        {/* Global snapshot placeholder */}
        <div className="panel-token border border-dashed border-token rounded-[var(--radius-md)] p-4 sm:p-5 h-full w-full mt-4 md:mt-0">
          <h2 className="text-[16px] font-medium leading-tight mb-2">Global snapshot</h2>
          <p className="text-[13px] text-muted">Future metrics and activity across the Wine Graph will appear here.</p>
        </div>
      </section>

      {/* Lower future feed region */}
      <section className="mt-6">
        <div className="panel-token border border-dashed border-token rounded-[var(--radius-md)] p-6">
          <p className="text-[14px] text-muted text-center">Wine Graph feed (coming soon)</p>
          <p className="text-[13px] text-muted text-center mt-1">Recent events and activity from across the graph will appear here.</p>
        </div>
      </section>
      </div>
    </main>
  );
};

export default GraphFeed;
