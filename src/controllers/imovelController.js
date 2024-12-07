import { ImovelSchema, ImovelUpdateSchema, ImovelFilterSchema } from '../schemas/imovelSchemas.js'; //importa os schemas de imóveis e servem para validar os dados
import Imovel from '../models/Imovel.js'; //importa o modelo de imóveis que contém as funções para manipular os dados como criar, atualizar, deletar, etc

//rota para listar todos os imóveis
export const getImoveis = async (req, res, next) => {
  try {
    const { 
      page = 1,
      limit = 10,
      tipo,
      finalidade,
      cidade,
      bairro,
      preco,
      quartos,
      vagas,
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
      preco: preco ? Number(preco) : undefined,
      quartos: quartos ? Number(quartos) : undefined,
      vagas: vagas ? Number(vagas) : undefined,
      status,
      destaque: destaque === 'true' ? true : destaque === 'false' ? false : undefined
    });

    if (error) {
      return res.status(400).json({ erro: error.details[0].message });
    }

    console.log('Filtros aplicados:', value);

    // Buscar imóveis
    const imoveis = await Imovel.listar({
      ...value,
      limit: parseInt(limit),
      offset
    });

    // Contar total
    const [{ count }] = await Imovel.contar(value);

    return res.json({
      imoveis,
      pagination: {
        total: Number(count),
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (erro) {
    console.error('Erro ao listar imóveis:', erro);
    return res.status(500).json({ 
      erro: 'Erro ao listar imóveis',
      detalhes: erro.message 
    });
  }
};

//rota para buscar um imóvel por id
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

//rota para criar um imóvel
export const createImovel = async (req, res, next) => {
  try {
    console.log('Iniciando criação de imóvel:', req.body); // Log para debug

    const { error, value } = ImovelSchema.validate(req.body);
    if (error) {
      console.log('Erro de validação:', error.details); // Log para debug
      return res.status(400).json({ erro: error.details[0].message });
    }

    // Verifica se o ID do corretor está presente
    if (!req.userId) {
    // if (req.userId === 2) {
      console.error("ID do corretor ausente!");
      return res.status(400).json({ erro: "Usuário não autenticado." });
    }

    // Adiciona o ID do corretor
    value.corretor_id = req.userId;
    // value.corretor_id = 2;
    console.log('Dados validados:', value); // Log para debug

    // Cria o imóvel
    const imovel = await Imovel.criar(value);
    console.log('Imóvel criado com sucesso:', imovel); // Log para debug

    // Responde com o imóvel criado
    return res.status(201).json(imovel);
  } catch (erro) {
    console.error('Erro ao criar imóvel:', erro); // Log detalhado
    // Responde com detalhes do erro
    return res.status(500).json({ 
      erro: 'Erro ao criar imóvel',
      detalhes: erro.message 
    });
  }
};

//rota para atualizar um imóvel
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

//rota para deletar um imóvel
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

//rota para destacar um imóvel
export const toggleDestaque = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { destaque } = req.body;

    // Validar se o valor de destaque foi fornecido
    if (destaque === undefined) {
      return res.status(400).json({ 
        erro: "Valor de destaque não fornecido",
        detalhes: "É necessário fornecer o valor 'true' ou 'false' para o campo destaque"
      });
    }

    // Validar se o valor é booleano
    if (typeof destaque !== 'boolean') {
      return res.status(400).json({ 
        erro: "Valor de destaque inválido",
        detalhes: "O campo destaque deve ser um valor booleano (true/false)"
      });
    }

    // Verifica se o imóvel existe
    const imovel = await Imovel.buscarPorId(id);
    if (!imovel) {
      return res.status(404).json({ 
        erro: "Imóvel não encontrado",
        detalhes: `Não foi encontrado um imóvel com o ID ${id}`
      });
    }

    // Verifica se o valor é diferente do atual
    if (imovel.destaque === destaque) {
      return res.status(200).json({ 
        mensagem: "Nenhuma alteração necessária",
        detalhes: `O imóvel já ${destaque ? 'está' : 'não está'} em destaque`
      });
    }

    // Atualiza o destaque
    const imovelAtualizado = await Imovel.atualizar(id, { destaque });

    // Log da operação
    console.log(`Destaque do imóvel ${id} alterado para ${destaque} por ${req.userId}`);

    return res.json({
      mensagem: "Destaque atualizado com sucesso",
      imovel: imovelAtualizado
    });

  } catch (erro) {
    console.error('Erro ao atualizar destaque:', erro);
    return res.status(500).json({ 
      erro: "Erro ao atualizar destaque",
      detalhes: erro.message 
    });
  }
}; 

//rota para contar os imóveis
export const contarImoveis = async (req, res, next) => {
  try {
    // Recebe os filtros da query
    const { 
      tipo,
      finalidade,
      cidade,
      bairro,
      preco,
      quartos,
      vagas,
      status,
      destaque
    } = req.query;

    // Prepara os filtros
    const filtros = {
      tipo,
      finalidade,
      cidade,
      bairro,
      preco: preco ? Number(preco) : undefined,
      quartos: quartos ? Number(quartos) : undefined,
      vagas: vagas ? Number(vagas) : undefined,
      status,
      destaque: destaque === 'true' ? true : destaque === 'false' ? false : undefined
    };

    // Remove filtros undefined
    Object.keys(filtros).forEach(key => 
      filtros[key] === undefined && delete filtros[key]
    );

    console.log('Filtros aplicados:', filtros);

    // Busca a contagem
    const [resultado] = await Imovel.contar(filtros);
    
    console.log('Resultado da contagem:', resultado);

    return res.json({
      total: Number(resultado.count),
      filtros: Object.keys(filtros).length > 0 ? filtros : 'sem filtros'
    });

  } catch (erro) {
    console.error('Erro ao contar imóveis:', erro);
    return res.status(500).json({ 
      erro: 'Erro ao contar imóveis',
      detalhes: erro.message 
    });
  }
};
