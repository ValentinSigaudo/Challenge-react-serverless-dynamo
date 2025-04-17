import { useForm } from "react-hook-form";
import { profileService } from "../services/profileService";
import { useState } from "react";

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  contact_role?: string;
  company_name?: string;
  note?: string;
  user_id: string;
};

interface ContactCardProps {
  contacts: Contact[];
  onContactAdded: () => void;
}

function ContactCard({ contacts, onContactAdded }: ContactCardProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Partial<Contact>>();

  const onDelete = async (contactId: number) => {
    try {
      await profileService.deleteContact(contactId);

      onContactAdded();
    } catch (err: any) {
      alert(err.message || "Ocurrió un error al eliminar contacto");
    }
  };
  const onEdit = (contact: Contact) => {
    setEditingId(contact.id);

    Object.entries(contact).forEach(([key, value]) => {
      setValue(key as keyof Contact, value);
    });
  };
  const onUpdate = async (data: Partial<Contact>) => {
    if (editingId != null) {
      try {
        await profileService.updateContact(editingId, data);
        setEditingId(null);
        reset();
        onContactAdded();
      } catch (err: any) {
        alert(err.message || "Error al actualizar contacto");
      }
    }
  };
  return (
    <ul className="space-y-3">
      {contacts.map((contact) => (
        <div>
          <li
            key={contact.id}
            className="bg-white p-4 shadow rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">First Name: {contact.first_name}</p>
              <p className="font-medium">Last Name: {contact.last_name}</p>
              <p className="font-medium">Email: {contact.email}</p>
              <p className="text-sm">Phone: {contact.phone}</p>
              {contact.company_name && (
                <p className="font-medium">
                  Company Name: {contact.company_name}
                </p>
              )}
              {contact.contact_role && (
                <p className="font-medium">Role: {contact.contact_role}</p>
              )}
              {contact.note && (
                <p className="font-medium">Note: {contact.note}</p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-1">
              <button
                className=" text-blue-500 hover:underline"
                onClick={() => onEdit(contact)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => onDelete(contact.id)}
              >
                Delete
              </button>
            </div>
          </li>
          {/* Formulario de edición */}
          {editingId === contact.id && (
            <form onSubmit={handleSubmit(onUpdate)} className="mt-4 space-y-2">
              {typeof errors.first_name?.message === "string" && (
                <span className="text-red-500 ">
                  {errors.first_name.message}
                </span>
              )}
              <input
                className="w-full border rounded px-3 py-1"
                placeholder="First Name"
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
              />
              {typeof errors.last_name?.message === "string" && (
                <span className="text-red-500 ">
                  {errors.last_name.message}
                </span>
              )}
              <input
                className="w-full border rounded px-3 py-1"
                placeholder="Last Name"
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
              />
              {typeof errors.email?.message === "string" && (
                <span className="text-red-500 ">{errors.email.message}</span>
              )}
              <input
                type="email"
                className="w-full border rounded px-3 py-1"
                placeholder="Email"
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                  pattern: {
                    value:
                      /^[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9]{1,63}\.){1,125}[A-Za-z]{2,63}$/,
                    message: "Invalid email",
                  },
                })}
              />
              {typeof errors.phone?.message === "string" && (
                <span className="text-red-500 ">{errors.phone.message}</span>
              )}
              <input
                type="tel"
                className="w-full border rounded px-3 py-1"
                placeholder="Phone"
                {...register("phone", {
                  required: { value: true, message: "Phone is required" },
                  pattern: {
                    value: /^\+?[0-9]{7,15}$/,
                    message: "Invalid Phone number",
                  },
                })}
              />
              <input
                className="w-full border rounded px-3 py-1"
                placeholder="Company Name"
                {...register("company_name")}
              />
              <input
                className="w-full border rounded px-3 py-1"
                placeholder="Role"
                {...register("contact_role")}
              />
              <input
                className="w-full border rounded px-3 py-1"
                placeholder="Note"
                {...register("note")}
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    reset();
                  }}
                  className=" w-[50%] px-3 py-1 border rounded text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-[50%] px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      ))}
    </ul>
  );
}

export default ContactCard;
