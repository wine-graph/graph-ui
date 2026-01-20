import {useAuth} from "./authContext.ts";

export const AuthDebug = () => {
  const {user, currentProvider, currentPosToken, isAuthenticated} = useAuth();
  return (
    <pre className="text-xs">
      {JSON.stringify({ isAuthenticated, user, currentProvider, currentPosToken }, null, 2)}
    </pre>
  );
}