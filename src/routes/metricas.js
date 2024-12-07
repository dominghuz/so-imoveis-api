import express from 'express';
import * as metricasController from '../controllers/metricasController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware de autenticação
router.use(authMiddleware);

// Rotas de métricas
router.get('/dashboard', metricasController.getDashboardStats);
router.get('/comissoes', metricasController.getComissoesPorCorretor);
router.get('/conversao', metricasController.getConversaoPorCorretor);
router.get('/vendas', metricasController.getVendasPorPeriodo);
router.get('/locacoes', metricasController.getLocacoesPorPeriodo);
router.get('/imoveis/tipo', metricasController.getImoveisPorTipo);
router.get('/imoveis/status', metricasController.getImoveisPorStatus);
router.get('/transacoes', metricasController.getTransacoesPorPeriodo);
router.get('/visitas/imovel', metricasController.getVisitasPorImovel);

export default router;
