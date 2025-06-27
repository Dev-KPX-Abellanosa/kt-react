import { useState, useEffect, useCallback } from 'react';
import type { Contact, CreateContactRequest, UpdateContactRequest, WebSocketContactEvent } from '../../types/contact.types';
import { contactService } from '../../services/contact.service';
import { wsService } from '../../services/websocket.service';

export const useContacts = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load initial contacts
    const loadContacts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await contactService.getContacts();
            setContacts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load contacts');
        } finally {
            setLoading(false);
        }
    }, []);

    // WebSocket event handler
    const handleContactUpdate = useCallback((event: WebSocketContactEvent) => {
        console.log('WebSocket event:', event);
        
        setContacts(prevContacts => {
            switch (event.type) {
                case 'contact_created':
                    return [...prevContacts, event.contact];
                case 'contact_updated':
                    return prevContacts.map(contact => 
                        contact.id === event.contact.id ? event.contact : contact
                    );
                case 'contact_deleted':
                    return prevContacts.filter(contact => contact.id !== event.contact.id);
                default:
                    return prevContacts;
            }
        });
    }, []);

    // CRUD operations
    const createContact = useCallback(async (contactData: CreateContactRequest) => {
        try {
            setError(null);
            const newContact = await contactService.createContact(contactData);
            return newContact;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create contact');
            throw err;
        }
    }, []);

    const updateContact = useCallback(async (id: string, contactData: UpdateContactRequest) => {
        try {
            setError(null);
            const updatedContact = await contactService.updateContact(id, contactData);
            return updatedContact;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update contact');
            throw err;
        }
    }, []);

    const deleteContact = useCallback(async (id: string) => {
        try {
            setError(null);
            await contactService.deleteContact(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete contact');
            throw err;
        }
    }, []);

    // Initialize WebSocket and load contacts
    useEffect(() => {
        // Set up WebSocket callback first
        wsService.onContactUpdate(handleContactUpdate);
        
        // Then connect
        wsService.connect();
        
        // Load contacts
        loadContacts();

        return () => {
            wsService.offContactUpdate();
        };
    }, []); // Empty dependency array to run only once

    return {
        contacts,
        loading,
        error,
        createContact,
        updateContact,
        deleteContact,
        refreshContacts: loadContacts
    };
}; 