import Google from "../assets/images/google.png";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/features/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleGoogleAuthLogin = () => {
    window.location.href = "https://wine-retailer.fly.dev/google/authenticate";
  };

  // Dummy login function
  const handleLogin = () => {
    dispatch(login());
    navigate("/profile");
  };

  return (
    <div className="flex-center w-full px-3 sm:px-0 sm:ml-8 my-4 sm:my-8">
      <div className="login-box w-md border border-border rounded-xl p-6 shadow">
        <h2 className="text-2xl mb-4 mx-auto text-center font-alan-sans text-textPrimary">
          Sign In
        </h2>
        <div className="content flex-center flex-col gap-3 my-10">
          <button
            onClick={handleGoogleAuthLogin}
            title="Sign in with Google"
            className="google outline-none flex-center gap-3 border border-gray-300 rounded-xl p-3 cursor-pointer hover:shadow hover:bg-gray-50 font-roboto text-base text-gray-700 transition-all duration-150"
          >
            <img
              src={Google}
              alt=""
              className="w-8 border p-1 rounded-full border-gray-200"
            />
            Sign in with Google
          </button>

          {/* Dummy login button */}
          <button
            onClick={handleLogin}
            className="outline-none flex-center gap-3 border border-gray-300 rounded-xl p-3 cursor-pointer hover:shadow hover:bg-gray-50 font-roboto text-base text-gray-700 transition-all duration-150"
          >
            Dummy Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
