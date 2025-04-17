import { useForm } from "react-hook-form";
import { profileService } from "../services/profileService";
import { useState } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
interface ContactFormProps {
  userId: string | undefined;
  onContactAdded: () => void;
}
function ContactForm({ userId, onContactAdded }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      contact_role: data.contact_role || "",
      company_name: data.company_name || "",
      note: data.note || "",
      user_id: userId,
    };
    try {
      await profileService.createContacts(payload);
      setLoading(false);
      reset();
      onContactAdded();
    } catch (err: any) {
      alert(err.message || "Error creating contact");
    }
  });

  return (
    <form className="mt-4 space-y-2 bg-white text-black" onSubmit={onSubmit}>
      <h2 className="text-xl  font-bold ">Add a contact</h2>

      {loading && <LoadingSpinner />}

      <label className="  font-bold " htmlFor="first_name">
        First Name
      </label>
      <input
        type="text"
        {...register("first_name", {
          required: { value: true, message: "First Name is required" },
          minLength: {
            value: 3,
            message: "First Name must be at least 3 characters",
          },
          maxLength: {
            value: 15,
            message: "First Name must be at most 15 characters",
          },
          pattern: {
            value: /^[a-zA-ZÀ-ÿ]+$/,
            message: "First Name can only be letters",
          },
        })}
        placeholder="Type First Name..."
        className="w-full border rounded px-3   mb-2"
      />
      {typeof errors.first_name?.message === "string" && (
        <span className="text-red-500 ">{errors.first_name.message}</span>
      )}

      <label className=" font-bold " htmlFor="last_name">
        Last Name
      </label>
      <input
        type="text"
        {...register("last_name", {
          required: { value: true, message: "Last Name is required" },
          minLength: {
            value: 3,
            message: "Last Name must be at least 3 characters",
          },
          maxLength: {
            value: 15,
            message: "Last Name must be at most 15 characters",
          },
          pattern: {
            value: /^[a-zA-ZÀ-ÿ]+$/,
            message: "Last Name can only be letters",
          },
        })}
        placeholder="Type Last Name..."
        className="w-full border rounded px-3  "
      />
      {typeof errors.last_name?.message === "string" && (
        <span className="text-red-500 mb-2">{errors.last_name.message}</span>
      )}

      <label className=" font-bold " htmlFor="email">
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
        className="w-full border rounded px-3  "
      />
      {typeof errors.email?.message === "string" && (
        <span className="text-red-500">{errors.email.message}</span>
      )}

      <label className=" font-bold " htmlFor="phone">
        Phone
      </label>
      <input
        type="tel"
        {...register("phone", {
          required: { value: true, message: "Phone is required" },
          pattern: {
            value: /^\+?[0-9]{7,15}$/,
            message: "Invalid Phone number",
          },
        })}
        placeholder="Type Phone..."
        className="w-full border rounded px-3  "
      />
      {typeof errors.phone?.message === "string" && (
        <span className="text-red-500">{errors.phone.message}</span>
      )}

      <label className=" font-bold " htmlFor="company_name">
        Company Name
      </label>
      <input
        type="text"
        {...register("company_name")}
        placeholder="Type Company Name..."
        className="w-full border rounded px-3  "
      />

      <label className=" font-bold " htmlFor="contact_role">
        Role
      </label>
      <input
        type="text"
        {...register("contact_role")}
        placeholder="Type Role..."
        className="w-full border rounded px-3  "
      />

      <label className=" font-bold " htmlFor="note">
        Note
      </label>
      <input
        type="textarea"
        {...register("note")}
        placeholder="Type Note..."
        className="w-full border rounded px-3  "
      />

      <button className="bg-green-500 text-white py-2 px-4 w-full rounded ">
        Submit
      </button>
    </form>
  );
}

export default ContactForm;
