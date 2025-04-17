import { useForm } from "react-hook-form";
import { signUp } from "../services/awsCognitoConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavigateButton from "../utils/NavigateButton";
import { useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";

function SignUpForm() {
  const { setPendingEmail } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const { email, password } = data;
    setLoading(true);
    try {
      await signUp(email, password);
      reset();
      setLoading(false);
      setPendingEmail(data.email);
      navigate("/confirm");
    } catch (err: any) {
      alert(err.message || "An error occurred during registration");
    }
  });

  return (
    <div>
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          } else {
          }
        }}
        onSubmit={onSubmit}
        className="bg-black text-white flex flex-col h-screen"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-4">Registrate</h1>

          <label className=" font-bold mb-4" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value:
                  /^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9]{1,63}\.){1,125}[A-Za-z]{2,63}$/,
                message: "Invalid email",
              },
            })}
            placeholder="Type Email..."
            className="p-2 border border-gray-300 rounded mb-4"
          />
          {typeof errors.email?.message === "string" && (
            <span className="text-red-500">{errors.email.message}</span>
          )}

          <label className=" font-bold mb-4" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: {
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) ||
                  "Must have at least one capital letter.",
                hasNumber: (value) =>
                  /\d/.test(value) || "Must have at least one number.",
                hasSymbol: (value) =>
                  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) ||
                  "Must have at least one symbol.",
              },
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-])/,
                message: "",
              },
            })}
            placeholder="Type password..."
            className="p-2 border border-gray-300 rounded mb-4"
          />
          {typeof errors.password?.message === "string" && (
            <span className="text-red-500">{errors.password.message}</span>
          )}

          <label className=" font-bold mb-4" htmlFor="secondPassword">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("secondPassword", {
              required: { value: true, message: "Repeat password is required" },
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            placeholder="Repeat password..."
            className="p-2 border border-gray-300 rounded mb-4"
          />
          {typeof errors.secondPassword?.message === "string" && (
            <span className="text-red-500">
              {errors.secondPassword.message}
            </span>
          )}
          <NavigateButton
            msg="already have an account? go to login"
            path="login"
          />
          {loading && <LoadingSpinner />}
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
