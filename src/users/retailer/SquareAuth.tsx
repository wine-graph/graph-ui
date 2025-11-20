import {useAuth} from "../../auth/authContext.ts";
import {startAuthorization} from "../../auth/authClient.ts";
import SectionCard from "../../components/common/SectionCard.tsx";
import {Store, QrCode} from "lucide-react";

const SquareAuth = () => {
  const {user} = useAuth();

  const handleConnect = () => {
    if (!user?.user.id) return;
    startAuthorization(user.user.id);
  };

  return (
    <button
      onClick={handleConnect}
      className="w-full text-left group focus-visible:outline-none"
    >
      <SectionCard
        cardHeader={{
          icon: Store,
          title: "Square POS",
        }}
        className="border-2 hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-muted)] hover:shadow-md hover:-translate-y-px transition-all duration-300 focus-visible:border-[color:var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
      >
        <div className="flex items-start gap-3 p-6">
          {/* Large QrCode on the left — clearly clickable */}
          <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200">
            <QrCode className="w-10 h-10" />
          </div>

          {/* All text to the right */}
          <div className="flex- 1">
            <p className="text-body text-fg-muted leading-snug">
              Connect your Square account to sync inventory and share!
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-fg-muted">
                Secure OAuth • Takes ~20 seconds
              </span>

              {/* Subtle minimal cue on the far right */}
              <span className="btn-minimal text-xs">
                Connect
                <span className="inline-block ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </div>
        </div>
      </SectionCard>
    </button>
  );
};

export default SquareAuth;