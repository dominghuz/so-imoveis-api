import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  listarTransacoes,
  buscarTransacao,
  criarTransacao,
  atualizarTransacao,
  deletarTransacao,
  estatisticasTransacoes
} from '../controllers/transacaoController.js';

const router = express.Router();

// Rotas com permissões específicas
router.get('/', authMiddleware(['admin', 'corretor', 'cliente']), listarTransacoes);
router.get('/estatisticas', authMiddleware(['admin', 'corretor']), estatisticasTransacoes);
router.get('/:id', authMiddleware(['admin', 'corretor', 'cliente']), buscarTransacao);

// Apenas corretores podem criar transações
router.post('/', authMiddleware(['corretor']), criarTransacao);

// Corretores podem atualizar suas próprias transações
router.put('/:id', authMiddleware(['admin', 'corretor']), atualizarTransacao);

// Apenas admin pode deletar
router.delete('/:id', authMiddleware(['admin']), deletarTransacao);

export default router; 