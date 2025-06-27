import { useState } from 'react';
import { ContactList } from '../../components/ContactList';
import { ContactDetail } from '../../components/ContactDetail';
import { ContactForm } from '../../components/ContactForm';
import { useContacts } from '../../../libs/hooks/useContacts';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../../../types/contact.types';

export default function ContactsPage() {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const { createContact, contacts, error, loading, deleteContact, updateContact } = useContacts();

    const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact);
        setShowCreateForm(false);
    };

    const handleCreateContact = async (data: CreateContactRequest) => {
        try {
            setFormLoading(true);
            await createContact(data);
            setShowCreateForm(false);
        } catch (error) {
            console.error('Failed to create contact:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteContact = async (id: string) => {
        await deleteContact(id);
    };

    const handleUpdateContact = async (id: string, data: UpdateContactRequest) => {
        await updateContact(id, data);
    };

    const handleCloseDetail = () => {
        setSelectedContact(null);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    };

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar - Contact List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            title="Add new contact"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                <ContactList
                    onContactSelect={handleContactSelect}
                    selectedContactId={selectedContact?.id}
                    contacts={contacts}
                    loading={loading}
                    error={error}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {showCreateForm ? (
                    <div className="flex-1 bg-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Add New Contact</h2>
                                <button
                                    onClick={handleCloseCreateForm}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ContactForm
                                onSubmit={handleCreateContact as (data: CreateContactRequest | UpdateContactRequest) => Promise<void>}
                                onCancel={handleCloseCreateForm}
                                loading={formLoading}
                            />
                        </div>
                    </div>
                ) : selectedContact ? (
                    <div className="flex-1 bg-white">
                        <ContactDetail
                            contact={selectedContact}
                            onClose={handleCloseDetail}
                            onDelete={handleDeleteContact}
                            onUpdate={handleUpdateContact}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Contact Selected</h3>
                            <p className="text-gray-500 mb-4">
                                Select a contact from the list to view details
                            </p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Contact
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 