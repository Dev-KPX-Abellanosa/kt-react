export interface Contact {
    id: string;
    user_id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateContactRequest {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface UpdateContactRequest {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface ContactResponse {
    success: boolean;
    data?: Contact | Contact[];
    message?: string;
    error?: string;
}

export interface WebSocketContactEvent {
    type: 'contact_created' | 'contact_updated' | 'contact_deleted';
    contact: Contact;
    userId: string;
} 