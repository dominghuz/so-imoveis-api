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

// Rotas com permissões específicas
router.get('/', authMiddleware(['admin', 'corretor', 'cliente']), listarAgendamentos);
router.get('/periodo', authMiddleware(['admin', 'corretor', 'cliente']), listarAgendamentosPorPeriodo);
router.get('/:id', authMiddleware(['admin', 'corretor', 'cliente']), buscarAgendamento);

// Clientes podem criar agendamentos
router.post('/', authMiddleware(['cliente']), criarAgendamento);

// Corretores podem atualizar status
router.put('/:id', authMiddleware(['admin', 'corretor']), atualizarAgendamento);

// Apenas admin pode deletar
router.delete('/:id', authMiddleware(['admin']), deletarAgendamento);

export default router; 