import type { Contact, CreateContactRequest, UpdateContactRequest, ContactResponse } from '../types/contact.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ContactService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async getContacts(): Promise<Contact[]> {
        const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }

        const data: ContactResponse = await response.json();
        return data.data as Contact[];
    }

    async getContactById(id: string): Promise<Contact> {
        const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch contact');
        }

        const data: ContactResponse = await response.json();
        return data.data as Contact;
    }

    async createContact(contactData: CreateContactRequest): Promise<Contact> {
        const response = await fetch(`${API_BASE_URL}/api/contacts`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error('Failed to create contact');
        }

        const data: ContactResponse = await response.json();
        return data.data as Contact;
    }

    async updateContact(id: string, contactData: UpdateContactRequest): Promise<Contact> {
        const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error('Failed to update contact');
        }

        const data: ContactResponse = await response.json();
        return data.data as Contact;
    }

    async deleteContact(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
    }
}

export const contactService = new ContactService(); 