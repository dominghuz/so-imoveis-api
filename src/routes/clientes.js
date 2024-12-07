import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  deletarCliente,
  estatisticasClientes,
  meuPerfil,
  atualizarMeuPerfil
} from '../controllers/clienteController.js';

const router = express.Router();

// Rota pública para registro de novos clientes
router.post('/', criarCliente);

// Rotas para clientes gerenciarem seu próprio perfil
router.get('/meu-perfil', authMiddleware(['cliente']), meuPerfil);
router.put('/meu-perfil', authMiddleware(['cliente']), atualizarMeuPerfil);

// Rotas protegidas - apenas corretores e admin podem acessar
router.get('/', authMiddleware(['admin', 'corretor']), listarClientes);
router.get('/estatisticas', authMiddleware(['admin', 'corretor']), estatisticasClientes);
router.get('/:id', authMiddleware(['admin', 'corretor']), buscarCliente);
router.put('/:id', authMiddleware(['admin', 'corretor']), atualizarCliente);
router.delete('/:id', authMiddleware(['admin']), deletarCliente);

export default router; 