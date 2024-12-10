import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getContratos,
  getContrato,
  createContrato,
  updateContrato,
  deleteContrato,
  gerarPDF
} from '../controllers/contratoController.js';

const router = express.Router();

// Rotas com permissões específicas
router.get('/', authMiddleware(['admin', 'corretor']), getContratos);
router.get('/:id', authMiddleware(['admin', 'corretor', 'cliente']), getContrato);
router.post('/', authMiddleware(['corretor']), createContrato);
router.put('/:id', authMiddleware(['admin', 'corretor']), updateContrato);
router.delete('/:id', authMiddleware(['admin']), deleteContrato);

// Rota para gerar PDF
router.get('/:id/pdf', authMiddleware(['admin', 'corretor', 'cliente']), gerarPDF);

export default router;  