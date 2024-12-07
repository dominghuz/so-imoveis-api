import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario
} from '../controllers/usuarioController.js';

const router = express.Router();

// Rotas protegidas - apenas admin pode gerenciar usuários
router.get('/', authMiddleware(['admin']), listarUsuarios);
router.get('/:id', authMiddleware(['admin']), buscarUsuario);
router.post('/', authMiddleware(['admin']), criarUsuario);
router.put('/:id', authMiddleware(['admin']), atualizarUsuario);
router.delete('/:id', authMiddleware(['admin']), deletarUsuario);

export default router; 