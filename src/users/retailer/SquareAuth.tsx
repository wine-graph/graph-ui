import {useAuth} from "../../auth/authContext.ts";
import {startAuthorization} from "../../auth/authClient.ts";
import {FaConnectdevelop} from "../../assets/icons.ts";
import SectionCard from "../../components/common/SectionCard.tsx";
import Button from "../../components/common/Button.tsx";

const SquareAuth = () => {
  const {user} = useAuth();

  const handleConnect = () => {
    if (!user?.user.id) return;
    startAuthorization(user.user.id);
  };

  return (
    <SectionCard cardHeader={{icon: FaConnectdevelop, title: "Connect to Square"}}>
      <div className="my-3 px-4">
        <p className="text-sm text-textSecondary mb-3">
          Connect your Square account to sync inventory and sales!
        </p>
        <Button
          onClick={handleConnect}
          className="bg-textPrimary-1 hover:bg-gray-600 text-white font-medium px-4 py-2 my-5"
        >
          <span className="text-sm">Connect with Square</span>
        </Button>
      </div>
    </SectionCard>
  );
};

export default SquareAuth;