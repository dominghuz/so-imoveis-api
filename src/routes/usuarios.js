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

// Rotas públicas
router.post('/', criarUsuario); // Registro de cliente

// Rotas protegidas
router.get('/', authMiddleware, listarUsuarios);
router.get('/:id', authMiddleware, buscarUsuario);
router.put('/:id', authMiddleware, atualizarUsuario);
router.delete('/:id', authMiddleware, deletarUsuario);

export default router; 