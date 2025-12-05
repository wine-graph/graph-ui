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
        className="border-2 border-neutral-200 hover:bg-neutral-50 transition-colors focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <div className="flex items-start gap-3 p-6">
          {/* Large QrCode on the left — clearly clickable */}
          <div className="flex-shrink-0 mt-1">
            <QrCode className="w-10 h-10" />
          </div>

          {/* All text to the right */}
          <div className="flex- 1">
            <p className="text-sm text-neutral-800 leading-snug">
              Connect your Square account to sync inventory into Wine Graph.
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-neutral-700">
                Secure OAuth • Takes ~20 seconds
              </span>

              {/* Subtle minimal cue on the far right */}
              <span className="text-xs text-neutral-900 underline">
                Connect
                <span className="inline-block ml-1.5">→</span>
              </span>
            </div>
          </div>
        </div>
      </SectionCard>
    </button>
  );
};

export default SquareAuth;