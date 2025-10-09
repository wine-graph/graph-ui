import PageHeader from "./common/PageHeader.tsx";

/**
 * The main component for wine discovery
 * Will wrap other components
 */
export const WineDiscovery = () => {
    return (
        <div className="w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
            <PageHeader
                title="Explore Wines"
                desc="Discover wines from around the world by region, varietal, or producer."
            />
        </div>
    );
}