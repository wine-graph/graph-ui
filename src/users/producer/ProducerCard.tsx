import {ChevronRight, Wine} from "lucide-react";
import type {Producer} from "./producer.ts";
import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import ProducerLogo from "./ProducerLogo.tsx";
import ContactLinks from "../../components/ContactLinks.tsx";
import {producerPath} from "../../app/routes.ts";

export const ProducerCard: React.FC<Producer> = ({
                                                   name,
                                                   slug,
                                                   wineCount,
                                                   wines = [],
                                                   email,
                                                   phone,
                                                   website,
                                                   logo,
                                                   social
                                                 }) => {

  const resolvedWineCount = wineCount ?? wines.length;
  const hasLogo = Array.isArray(logo) && logo.length > 0;
  const resolvedLogo = hasLogo ? logo : undefined;
  const resolvedWebsite = website ?? "";
  const resolvedEmail = email ?? "";
  const resolvedPhone = phone ?? "";
  const resolvedSocial = social?.length ? social : undefined;
  const resolvedSlug = slug ?? "";

  const navigate = useNavigate();
  const handleOpen = useCallback(() => {
    const href = producerPath({slug: resolvedSlug});
    if (href) navigate(href);
  }, [navigate, resolvedSlug]);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      className="group relative panel-token border border-border rounded-lg p-6 hover:bg-muted hover:shadow-(--shadow-soft) hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]">

      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <ProducerLogo logo={resolvedLogo} name={name}/>
            <h3 className="text-xl font-bold text-(--color-fg) leading-tight">
              {name}
            </h3>
          </div>
          <ChevronRight
            className="w-5 h-5 text-(--color-fg-muted) group-hover:text-accent group-hover:translate-x-1 transition-all"/>
        </div>

        <div className="text-sm">
          <span className="font-semibold text-(--color-fg)">
            <Wine
              className="w-4.5 h-4.5 inline-block align-text-bottom mr-1"/> {resolvedWineCount} {resolvedWineCount === 1 ? "wine" : "wines"}
          </span>
        </div>

        <ContactLinks
          website={resolvedWebsite}
          email={resolvedEmail}
          phone={resolvedPhone}
          social={resolvedSocial}
          className="pt-5 border-t border-border border-opacity-40"
          onLinkClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
