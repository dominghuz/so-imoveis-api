import { ImovelSchema, ImovelUpdateSchema, ImovelFilterSchema } from '../schemas/imovelSchemas.js';
import Imovel from '../models/Imovel.js';

export const getImoveis = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      tipo,
      finalidade,
      cidade,
      bairro,
      preco_min,
      preco_max,
      quartos_min,
      vagas_min,
      status,
      destaque
    } = req.query;

    const offset = (page - 1) * limit;

    // Validar filtros
    const { error, value } = ImovelFilterSchema.validate({
      tipo,
      finalidade,
      cidade,
      bairro,
      preco_min,
      preco_max,
      quartos_min,
      vagas_min,
      status,
      destaque: destaque === 'true'
    });

    if (error) {
      return res.status(400).json({ erro: error.details[0].message });
    }

    // Buscar imóveis com filtros
    const imoveis = await Imovel.listar({
      ...value,
      limit: parseInt(limit),
      offset
    });

    // Contar total de imóveis para paginação
    const [{ count }] = await Imovel.contar(value);

    res.json({
      imoveis,
      pagination: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getImovel = async (req, res, next) => {
  try {
    const imovel = await Imovel.buscarPorId(req.params.id);

    if (!imovel) {
      const error = new Error('Imóvel não encontrado');
      error.status = 404;
      throw error;
    }
    
    res.json(imovel);
  } catch (error) {
    next(error);
  }
};

export const createImovel = async (req, res, next) => {
  try {
    const { error, value } = ImovelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ erro: error.details[0].message });
    }

    // Adiciona o ID do usuário logado como corretor
    value.corretor_id = req.userId;

    const imovel = await Imovel.criar(value);
    return res.status(201).json(imovel);
  } catch (erro) {
    next(erro);
  }
};

export const updateImovel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = ImovelUpdateSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ erro: error.details[0].message });
    }

    // Verifica se o imóvel existe e pertence ao corretor
    const imovel = await Imovel.buscarPorId(id);
    if (!imovel) {
      return res.status(404).json({ erro: "Imóvel não encontrado" });
    }

    if (imovel.corretor_id !== req.userId) {
      return res.status(403).json({ erro: "Sem permissão para atualizar este imóvel" });
    }

    const imovelAtualizado = await Imovel.atualizar(id, value);
    return res.json(imovelAtualizado);
  } catch (erro) {
    next(erro);
  }
};

export const deleteImovel = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verifica se o imóvel existe e pertence ao corretor
    const imovel = await Imovel.buscarPorId(id);
    if (!imovel) {
      return res.status(404).json({ erro: "Imóvel não encontrado" });
    }

    if (imovel.corretor_id !== req.userId) {
      return res.status(403).json({ erro: "Sem permissão para deletar este imóvel" });
    }

    await Imovel.deletar(id);
    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
};

export const toggleDestaque = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { destaque } = req.body;

    // Verifica se o imóvel existe
    const imovel = await Imovel.buscarPorId(id);
    if (!imovel) {
      return res.status(404).json({ erro: "Imóvel não encontrado" });
    }

    // Apenas administradores podem destacar imóveis
    // Você pode adicionar essa verificação depois
    const imovelAtualizado = await Imovel.atualizar(id, { destaque });
    return res.json(imovelAtualizado);
  } catch (erro) {
    next(erro);
  }
}; 