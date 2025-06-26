import type { Contact, CreateContactRequest, UpdateContactRequest } from '../types/contact.types';
import { api } from '../libs/utils/axios';

class ContactService {
    async getContacts(): Promise<Contact[]> {
        const response = await api.get('/contacts');
        return response.data.data as Contact[];
    }

    async getContactById(id: string): Promise<Contact> {
        const response = await api.get(`/contacts/${id}`);
        return response.data.data as Contact;
    }

    async createContact(contactData: CreateContactRequest): Promise<Contact> {
        const response = await api.post('/contacts', contactData);
        return response.data.data as Contact;
    }

    async updateContact(id: string, contactData: UpdateContactRequest): Promise<Contact> {
        const response = await api.put(`/contacts/${id}`, contactData);
        return response.data.data as Contact;
    }

    async deleteContact(id: string): Promise<void> {
        await api.delete(`/contacts/${id}`);
    }
}

export const contactService = new ContactService(); 