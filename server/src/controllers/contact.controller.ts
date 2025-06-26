import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { Contact, CreateContactRequest, UpdateContactRequest, ContactResponse } from '../types/contact.types';
import { WebSocketService } from '../services/websocket.service';

// Global WebSocket service instance (will be set from app.ts)
let wsService: WebSocketService | null = null;

export const setWebSocketService = (service: WebSocketService) => {
    wsService = service;
};

export const createContact = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const contactData: CreateContactRequest = req.body;
        
        if (!contactData.name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            } as ContactResponse);
        }

        const contactId = uuidv4();
        const [result] = await pool.execute(
            'INSERT INTO contacts (id, user_id, name, email, phone, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [contactId, userId, contactData.name, contactData.email, contactData.phone, contactData.address, contactData.notes]
        );

        const [newContact] = await pool.execute(
            'SELECT * FROM contacts WHERE id = ?',
            [contactId]
        );

        const contact = (newContact as any)[0] as Contact;

        // Emit WebSocket event for real-time update
        if (wsService) {
            wsService.emitContactCreated(contact, userId);
        }

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Contact created successfully'
        } as ContactResponse);

    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        } as ContactResponse);
    }
};

export const getContacts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        console.log(req.user);
        const [contacts] = await pool.execute(
            'SELECT * FROM contacts WHERE user_id = ? ORDER BY name ASC',
            [userId]
        );

        res.json({
            success: true,
            data: contacts as Contact[]
        } as ContactResponse);

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        } as ContactResponse);
    }
};

export const getContactById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const contactId = req.params.id;

        const [contacts] = await pool.execute(
            'SELECT * FROM contacts WHERE id = ? AND user_id = ?',
            [contactId, userId]
        );

        if ((contacts as any).length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            } as ContactResponse);
        }

        res.json({
            success: true,
            data: (contacts as any)[0] as Contact
        } as ContactResponse);

    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        } as ContactResponse);
    }
};

export const updateContact = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const contactId = req.params.id;
        const updateData: UpdateContactRequest = req.body;

        // Check if contact exists and belongs to user
        const [existingContacts] = await pool.execute(
            'SELECT * FROM contacts WHERE id = ? AND user_id = ?',
            [contactId, userId]
        );

        if ((existingContacts as any).length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            } as ContactResponse);
        }

        // Build update query dynamically
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (updateData.name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(updateData.name);
        }
        if (updateData.email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(updateData.email);
        }
        if (updateData.phone !== undefined) {
            updateFields.push('phone = ?');
            updateValues.push(updateData.phone);
        }
        if (updateData.address !== undefined) {
            updateFields.push('address = ?');
            updateValues.push(updateData.address);
        }
        if (updateData.notes !== undefined) {
            updateFields.push('notes = ?');
            updateValues.push(updateData.notes);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No fields to update'
            } as ContactResponse);
        }

        updateValues.push(contactId, userId);

        await pool.execute(
            `UPDATE contacts SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
            updateValues
        );

        const [updatedContacts] = await pool.execute(
            'SELECT * FROM contacts WHERE id = ? AND user_id = ?',
            [contactId, userId]
        );

        const updatedContact = (updatedContacts as any)[0] as Contact;

        // Emit WebSocket event for real-time update
        if (wsService) {
            wsService.emitContactUpdated(updatedContact, userId);
        }

        res.json({
            success: true,
            data: updatedContact,
            message: 'Contact updated successfully'
        } as ContactResponse);

    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        } as ContactResponse);
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const contactId = req.params.id;

        // Check if contact exists and belongs to user
        const [existingContacts] = await pool.execute(
            'SELECT * FROM contacts WHERE id = ? AND user_id = ?',
            [contactId, userId]
        );

        if ((existingContacts as any).length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            } as ContactResponse);
        }

        const contactToDelete = (existingContacts as any)[0] as Contact;

        await pool.execute(
            'DELETE FROM contacts WHERE id = ? AND user_id = ?',
            [contactId, userId]
        );

        // Emit WebSocket event for real-time update
        if (wsService) {
            wsService.emitContactDeleted(contactToDelete, userId);
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        } as ContactResponse);

    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        } as ContactResponse);
    }
}; 