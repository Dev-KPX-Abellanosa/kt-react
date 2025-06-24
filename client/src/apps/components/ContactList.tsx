import React, { useState } from 'react';
import { useContacts } from '../../libs/hooks/useContacts';
import type { Contact } from '../../types/contact.types';
import { tw } from '../../libs/tw';

interface ContactListProps {
    onContactSelect?: (contact: Contact) => void;
    selectedContactId?: string;
}

export const ContactList: React.FC<ContactListProps> = ({ 
    onContactSelect, 
    selectedContactId 
}) => {
    const { contacts, loading, error } = useContacts();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        {searchTerm ? 'No contacts found' : 'No contacts yet'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredContacts.map((contact) => (
                            <ContactItem
                                key={contact.id}
                                contact={contact}
                                isSelected={contact.id === selectedContactId}
                                onClick={() => onContactSelect?.(contact)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Count */}
            <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                    {filteredContacts.length} of {contacts.length} contacts
                </p>
            </div>
        </div>
    );
};

interface ContactItemProps {
    contact: Contact;
    isSelected: boolean;
    onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isSelected, onClick }) => {
    return (
        <div
            className={tw(
                "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
            )}
            onClick={onClick}
        >
            <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {contact.name.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                    </h3>
                    {contact.email && (
                        <p className="text-sm text-gray-500 truncate">
                            {contact.email}
                        </p>
                    )}
                    {contact.phone && (
                        <p className="text-sm text-gray-500 truncate">
                            {contact.phone}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}; 