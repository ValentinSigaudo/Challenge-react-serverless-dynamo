import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { confirmCode } from "../services/awsCognitoConfig";

function ConfirmSignUpForm() {
  const { pendingEmail } = useAuth();
  const navigate = useNavigate();
  if (!pendingEmail) {
    alert("espera");
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: pendingEmail || "",
      code: "",
    },
  });

  const onSubmit = handleSubmit(async ({ email, code }) => {
    try {
      await confirmCode(email, code);
      navigate("/login");
    } catch (error: any) {
      console.error(error);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-black text-white flex flex-col h-screen"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-6">Confirmá tu cuenta</h1>

        <label className="font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className="p-2 border border-gray-300 rounded mb-4 bg-gray-200 text-gray-700"
          placeholder="Tu email"
          readOnly
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message as string}</span>
        )}

        <label className="font-bold mb-2" htmlFor="code">
          Confirmation Code
        </label>
        <input
          type="text"
          {...register("code", {
            required: "El código es requerido",
            minLength: { value: 6, message: "Debe tener 6 dígitos" },
          })}
          className="p-2 border border-gray-300 rounded mb-4"
          placeholder="Código que recibiste"
        />
        {errors.code && (
          <span className="text-red-500">{errors.code.message as string}</span>
        )}

        <button className="bg-blue-500 text-white py-2 px-4 rounded">
          Confirm account
        </button>
      </div>
    </form>
  );
}

export default ConfirmSignUpForm;
