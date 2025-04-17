const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const profileService = {
  findContacts: async (userId?: string) => {
    if (!userId) {
      throw new Error("User ID is required to find contacts");
    }
    const response = await fetch(`${API_BASE_URL}/contacts/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error finding a user");
    }

    return response.json();
  },
  createContacts: async (contact: any) => {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error creating contact");
    }

    return response.json();
  },

  deleteContact: async (contactId: number) => {
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error deleting contact");
    }

    return "Contact deleted successfully";
  },
  updateContact: async (contactId: number, contact: any) => {
    const { id, ...contactWithoutId } = contact;
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactWithoutId),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Error editing contact");
    }

    return "Contact edited successfully";
  },
};
