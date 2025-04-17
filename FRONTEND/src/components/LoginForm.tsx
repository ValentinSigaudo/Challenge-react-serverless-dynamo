import { useForm } from "react-hook-form";
import { login } from "../services/awsCognitoConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import NavigateButton from "../utils/NavigateButton";
type LoginFormInputs = {
  email: string;
  password: string;
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setLoading(true);
    try {
      const tokens = await login(data.email, data.password);

      if (tokens?.IdToken) {
        setLoading(false);
        navigate("/profile");
      } else {
        setLoading(false);
        setError("Verify your credentials");
      }
    } catch (err: any) {
      console.error("Error de login:", err);
      if (err.name === "UserNotConfirmedException") {
        setLoading(false);
        setError("Unconfirmed user. Please confirm your account.");
      } else if (err.name === "NotAuthorizedException") {
        setLoading(false);
        setError("Invalid credentials.");
      } else if (err.name === "UserNotFoundException") {
        setLoading(false);
        setError("User doesn's exist.");
      } else {
        setLoading(false);
        setError(err.message || "Unkwown error occurred.");
      }
    }
  });

  return (
    <form
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        } else {
        }
      }}
      onSubmit={onSubmit}
      className="bg-black text-white h-screen"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-6">Iniciar Sesión</h1>

        <label htmlFor="email" className="mb-1 font-semibold">
          Email
        </label>
        <input
          {...register("email", {
            required: "Email Required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid Email",
            },
          })}
          className="p-2 border border-gray-300 rounded mb-4 text-white"
          placeholder="john_doe@email.com"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <label htmlFor="password" className="mb-1 font-semibold">
          Password
        </label>
        <input
          type="password"
          {...register("password", {
            required: "Password required",
          })}
          className="p-2 border border-gray-300 rounded mb-4 text-white"
          placeholder="Your password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        {error && <span className="text-red-500 mt-2">{error}</span>}
        <NavigateButton
          msg="don't have an account yet? register"
          path="register"
        />
        {loading && <LoadingSpinner />}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
        >
          Log In
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
