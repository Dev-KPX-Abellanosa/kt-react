import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
} from '../controllers/contact.controller';

const router = Router();

// All contact routes require authentication
router.use(authenticateToken);

// GET /api/contacts - Get all contacts for the authenticated user
router.get('/', getContacts);

// GET /api/contacts/:id - Get a specific contact
router.get('/:id', getContactById);

// POST /api/contacts - Create a new contact
router.post('/', createContact);

// PUT /api/contacts/:id - Update a contact
router.put('/:id', updateContact);

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', deleteContact);

export default router; 