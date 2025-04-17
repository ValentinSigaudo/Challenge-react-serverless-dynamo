import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { profileService } from "../services/profileService";
import ContactForm from "./ContactForm";
import ContactCard from "./ContactCard";
type DecodedToken = {
  email?: string;
  sub?: string;
  exp?: number;
  [key: string]: any;
};
const UserProfile = () => {
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
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
  }, []);

  const loadContacts = async () => {
    const result = await profileService.findContacts(user?.sub);
    setContacts(result.contacts);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const result = await profileService.findContacts(user?.sub);
        setContacts(result.contacts);
      } catch (err) {
        console.error("Error al traer contactos", err);
      }
    };
    fetchContacts();
  }, [user?.sub]);

  if (!user) {
    return <p className="text-white">Loading Profile.</p>;
  }

  return (
    <div className=" bg-blue-200text-black">
      <div className="max-w-7xl  bg-blue-200 mx-auto p-8 items-center justify-center">
        <h2 className="text-2xl font-semibold mb-2">Welcome {user.email} !</h2>

        <div className=" border-solid p-8 flex flex-col items-center justify-center">
          <div className=" bg-white text-white  rounded shadow p-6 mx-auto">
            <ContactForm userId={user.sub} onContactAdded={loadContacts} />
          </div>
        </div>
        <div className="  bg-blue-200 p-8 flex flex-col items-center justify-center">
          <div className="text-black rounded shadow p-6 w-full mx-auto">
            <h2 className="text-xl font-bold mb-4">Contacts</h2>
            <ContactCard contacts={contacts} onContactAdded={loadContacts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
