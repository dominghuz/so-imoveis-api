import express from 'express';
import { transacoesController } from '../controllers/transacoesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas protegidas por autenticação
router.use(authMiddleware);

// GET /api/transacoes - Lista todas as transações
router.get('/', transacoesController.listar);

// GET /api/transacoes/:id - Busca uma transação específica
router.get('/:id', transacoesController.buscarPorId);

// POST /api/transacoes - Cria uma nova transação
router.post('/', transacoesController.criar);

// PATCH /api/transacoes/:id/status - Atualiza o status de uma transação
router.patch('/:id/status', transacoesController.atualizarStatus);

// DELETE /api/transacoes/:id - Exclui uma transação
router.delete('/:id', transacoesController.excluir);

export default router; 