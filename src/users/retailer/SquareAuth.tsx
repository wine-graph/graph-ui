import SectionCard from "../../components/common/SectionCard.tsx";
import {FaConnectdevelop} from "../../assets/icons.ts";
import Button from "../../components/common/Button.tsx";
import {useAuth} from "../../context/authContext.ts";

const SquareAuth = () => {
  const {user} = useAuth();

  const squareUrl = import.meta.env.DEV
    ? `http://localhost:8082/square/authorize?id=${user?.user.id}`
    : `https://graph-auth.fly.dev/square/authorize?id=${user?.user.id}`;

  const handleConnect = () => {
    try {
      // mark that we should refresh the user once we return from Square
      sessionStorage.setItem("squareAuthPending", "1");
    } catch {
      // ignore storage errors
    }
    window.location.assign(squareUrl);
  };

  return (
    <SectionCard
      cardHeader={{icon: FaConnectdevelop, title: "Connect to Square"}}
    >
      <div className="my-3 px-4">
        <p className="text-sm text-textSecondary mb-3">
          Connect your Square account to sync inventory and sales!
        </p>
        <Button className="bg-textPrimary-1 hover:bg-gray-600 text-white font-medium px-4 py-2 my-5"
                onClick={handleConnect}>
          <span className="text-sm">Connect with Square</span>
        </Button>
      </div>
    </SectionCard>
  );
};

export default SquareAuth;
