import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import imoveisRoutes from './routes/imoveis.js';
import fotosRoutes from './routes/fotos.js';
import clientesRoutes from './routes/clientes.js';
import agendamentosRoutes from './routes/agendamentos.js';
import transacoesRoutes from './routes/transacoes.js';
import contratosRoutes from './routes/contratos.js';
import metricasRoutes from './routes/metricas.js';
import usuariosRoutes from './routes/usuarios.js';
import { errorHandler } from './middleware/errorHandler.js';
// import Imovel from './models/Imovel.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API Imobiliária está funcionando!' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/imoveis', imoveisRoutes);
app.use('/api/fotos', fotosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/transacoes', transacoesRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/metricas', metricasRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Melhor tratamento de erros na inicialização do servidor
const startServer = async () => {
  try {
    // Verifica estrutura da tabela
    // console.log('Verificando estrutura da tabela imoveis...');
    // await Imovel.verificarEstrutura();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
  process.exit(1);
}); 