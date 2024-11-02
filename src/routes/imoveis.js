import express from 'express';
import { 
  getImoveis, 
  getImovel, 
  createImovel, 
  updateImovel, 
  deleteImovel,
  toggleDestaque 
} from '../controllers/imovelController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getImoveis);
router.get('/:id', getImovel);
router.post('/', authMiddleware, createImovel);
router.put('/:id', authMiddleware, updateImovel);
router.delete('/:id', authMiddleware, deleteImovel);
router.patch('/:id/destaque', authMiddleware, toggleDestaque);

export default router; 