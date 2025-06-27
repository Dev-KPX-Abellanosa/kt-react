import React, { useState } from 'react';
import type { Contact, UpdateContactRequest } from '../../types/contact.types';
import { ContactForm } from './ContactForm';


interface ContactDetailProps {
    contact: Contact;
    onClose: () => void;
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, data: UpdateContactRequest) => Promise<void>;
}

export const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onClose, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleUpdate = async (data: UpdateContactRequest) => {
        try {
            setLoading(true);
            await onUpdate(contact.id, data);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update contact:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                setLoading(true);
                await onDelete(contact.id);
                onClose();
            } catch (error) {
                console.error('Failed to delete contact:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (isEditing) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Contact</h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <ContactForm
                    contact={contact}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                    loading={loading}
                />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                        disabled={loading}
                    >
                        Edit
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Avatar and Name */}
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                        {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">Contact</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    {contact.email && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
                        </div>
                    )}

                    {contact.phone && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="mt-1 text-sm text-gray-900">{contact.phone}</p>
                        </div>
                    )}

                    {contact.address && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{contact.address}</p>
                        </div>
                    )}

                    {contact.notes && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete Contact'}
                        </button>
                        <div className="text-xs text-gray-500">
                            Created: {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 