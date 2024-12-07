import express from 'express'; //importa o express para criar rotas 
import { 
  getImoveis, //rota para listar todos os imóveis
  getImovel, //rota para listar um imóvel específico  
  createImovel, //rota para criar um imóvel
  updateImovel, //rota para atualizar um imóvel 
  deleteImovel, //rota para deletar um imóvel
  toggleDestaque, //rota para atualizar o campo destaque de um imóvel
  contarImoveis //rota para contar todos os imóveis
} from '../controllers/imovelController.js'; //importa os controllers de imóveis
import { authMiddleware } from '../middleware/authMiddleware.js'; //importa o middleware de autenticação 

const router = express.Router(); //cria um router para as rotas

// Rotas públicas
router.get('/', getImoveis); //rota para listar todos os imóveis  
router.get('/contar', contarImoveis); //rota para contar todos os imóveis
router.get('/:id', getImovel); //rota para listar um imóvel específico

// Rotas que precisam de autenticação
router.post('/', authMiddleware(['corretor', 'admin']), createImovel); //rota para criar um imóvel
router.put('/:id', authMiddleware(['corretor', 'admin']), updateImovel); //rota para atualizar um imóvel 
router.delete('/:id', authMiddleware(['corretor', 'admin']), deleteImovel); //rota para deletar um imóvel
router.patch('/:id/destaque', authMiddleware(['admin']), toggleDestaque); //rota para atualizar o campo destaque de um imóvel

export default router; //exporta o router para ser usado em outros arquivos
