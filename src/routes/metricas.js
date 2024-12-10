import express from 'express';
import * as metricasController from '../controllers/metricasController.js';
import * as metricasImoveisController from '../controllers/metricasImoveisController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas de métricas
router.use(authMiddleware(['admin', 'corretor']));

// Rota geral
// Retorna imoveis, transações  eagendamemnto
router.get('/dashboard', metricasController.getDashboardStats);

// Rotas de métricas de imóveis
router.get('/imoveis/dashboard', metricasImoveisController.getDashboardStats);
router.get('/imoveis/tipo', metricasImoveisController.getImoveisPorTipo);
router.get('/imoveis/status', metricasImoveisController.getImoveisPorStatus);


// Rotas de métricas
router.get('/comissoes', metricasController.getComissoesPorCorretor);
router.get('/conversao', metricasController.getConversaoPorCorretor);
router.get('/vendas', metricasController.getVendasPorPeriodo);
router.get('/locacoes', metricasController.getLocacoesPorPeriodo);
// router.get('/imoveis/tipo', metricasController.getImoveisPorTipo);
// router.get('/imoveis/status', metricasController.getImoveisPorStatus);
router.get('/transacoes', metricasController.getTransacoesPorPeriodo);
router.get('/visitas/imovel', metricasController.getVisitasPorImovel);

export default router;
