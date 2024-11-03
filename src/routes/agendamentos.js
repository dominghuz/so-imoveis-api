import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  listarAgendamentos,
  buscarAgendamento,
  criarAgendamento,
  atualizarAgendamento,
  deletarAgendamento,
  listarAgendamentosPorPeriodo
} from '../controllers/agendamentoController.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.get('/', listarAgendamentos);
router.get('/periodo', listarAgendamentosPorPeriodo);
router.get('/:id', buscarAgendamento);
router.post('/', criarAgendamento);
router.put('/:id', atualizarAgendamento);
router.delete('/:id', deletarAgendamento);

export default router; 