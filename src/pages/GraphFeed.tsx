import {ArrowRight, TrendingUp} from "lucide-react";
import {Link} from "react-router-dom";
import {useAuth} from "../auth";
import {Card, SectionTitle} from "../components/ui";

const GraphFeed = () => {
  const {isRetailer, isProducer} = useAuth();

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
    <div className="max-w-6xl mx-auto w-full">
      <Card tone="pop" className="px-7 py-7 sm:px-9 sm:py-10">
        <SectionTitle
          as="h1"
          eyebrow="Shared Intelligence"
          title="A living map of wine supply and discovery."
          desc="Retailers sync inventory, producers refine source data, and everyone gets more accurate recommendations."
          titleClassName="text-heading max-w-3xl"
          descClassName="text-body text-muted max-w-3xl mt-4 text-compact"
        />

        <form role="search" className="mt-7" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="feed-search" className="sr-only">Search</label>
          <div className="h-12 rounded-[var(--radius-md)] border border-token bg-token px-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[color:var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[color:var(--color-bg)]">
            <TrendingUp className="w-4 h-4 text-fg-muted" aria-hidden="true"/>
            <input
              id="feed-search"
              type="search"
              placeholder="Search wines, producers, retailers, and regions"
              className="w-full h-full bg-transparent text-[15px] placeholder:text-[color:var(--color-fg-muted)] focus:outline-none"
            />
          </div>
        </form>
      </Card>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
        <Card className="p-6">
          <SectionTitle title="You in the graph" titleClassName="text-[24px]" />
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-label text-fg-muted">Your contribution</p>
              <ul className="list-disc pl-5 mt-2 text-body space-y-1.5">
                {youContent.contribution.map((line, i) => (
                  <li key={`c-${i}`}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-label text-fg-muted">What you get</p>
              <ul className="list-disc pl-5 mt-2 text-body space-y-1.5">
                {youContent.gets.map((line, i) => (
                  <li key={`g-${i}`}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Link to={youContent.actionHref} className="btn btn-primary focus-accent">
              {youContent.actionLabel}
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </Card>

        <article className="rounded-[var(--radius-lg)] border border-dashed border-token panel-token p-6">
          <p className="text-label text-fg-muted">Global snapshot</p>
          <p className="text-body text-muted mt-3">Cross-network metrics and recent contribution activity will appear here.</p>
        </article>
      </section>

      <section className="mt-5 rounded-[var(--radius-lg)] border border-dashed border-token panel-token p-8">
        <p className="text-body text-muted text-center">Graph activity feed coming soon</p>
      </section>
    </div>
  );
};

export default GraphFeed;
