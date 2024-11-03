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

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', listarTransacoes);
router.get('/estatisticas', estatisticasTransacoes);
router.get('/:id', buscarTransacao);
router.post('/', criarTransacao);
router.put('/:id', atualizarTransacao);
router.delete('/:id', deletarTransacao);

export default router; 