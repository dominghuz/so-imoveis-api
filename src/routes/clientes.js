import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  deletarCliente,
  estatisticasClientes
} from '../controllers/clienteController.js';

const router = express.Router();

// Rotas protegidas (apenas para corretores e admin)
router.get('/', authMiddleware, listarClientes);
router.get('/estatisticas', authMiddleware, estatisticasClientes);
router.get('/:id', authMiddleware, buscarCliente);
router.post('/', authMiddleware, criarCliente);
router.put('/:id', authMiddleware, atualizarCliente);
router.delete('/:id', authMiddleware, deletarCliente);

export default router; 