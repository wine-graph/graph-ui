import {useAuth} from "./authContext.ts";

export const AuthDebug = () => {
  const {user, pos, isAuthenticated} = useAuth();
  return (
    <pre className="text-xs">
      {JSON.stringify({ isAuthenticated, user, pos }, null, 2)}
    </pre>
  );
}