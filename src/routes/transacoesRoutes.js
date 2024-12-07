import express from 'express';
import { transacoesController } from '../controllers/transacoesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas protegidas por autenticação
router.use(authMiddleware);

// GET /api/transacoes - Lista todas as transações
router.get('/transacoes', transacoesController.listar);

// GET /api/transacoes/balanco - Calcula o balanço das transações
router.get('/transacoes/balanco', transacoesController.balanco);

// POST /api/transacoes - Cria uma nova transação
router.post('/transacoes', transacoesController.criar);

// PUT /api/transacoes/:id - Atualiza uma transação existente
router.put('/transacoes/:id', transacoesController.atualizar);

// DELETE /api/transacoes/:id - Exclui uma transação
router.delete('/transacoes/:id', transacoesController.excluir);

export default router; 