import Transacao from '../models/Transacao.js';
import Imovel from '../models/Imovel.js';

export const listarTransacoes = async (req, res, next) => {
  try {
    const { 
      tipo,
      status,
      corretor_id,
      cliente_id,
      data_inicio,
      data_fim,
      page = 1,
      limit = 10
    } = req.query;

    const filtros = {
      tipo,
      status,
      data_inicio,
      data_fim,
      limit: parseInt(limit),
      offset: (page - 1) * limit
    };

    // Restringe visualização baseado no tipo de usuário
    if (req.userTipo === 'corretor') {
      filtros.corretor_id = req.userId;
    } else if (req.userTipo === 'cliente') {
      filtros.cliente_id = req.userId;
    }

    const transacoes = await Transacao.listar(filtros);
    const total = await Transacao.contar(filtros);

    res.json({
      transacoes,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const buscarTransacao = async (req, res, next) => {
  try {
    const transacao = await Transacao.buscarPorId(req.params.id);
    
    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    // Verifica permissão
    if (req.userTipo !== 'admin' && 
        req.userId !== transacao.cliente_id && 
        req.userId !== transacao.corretor_id) {
      return res.status(403).json({ erro: 'Sem permissão para ver esta transação' });
    }
    
    res.json(transacao);
  } catch (error) {
    next(error);
  }
};

export const criarTransacao = async (req, res, next) => {
  try {
    const { 
      imovel_id, 
      cliente_id, 
      tipo, 
      valor,
      data_inicio,
      data_fim,
      contrato_url 
    } = req.body;

    // Verifica se o imóvel existe e está disponível
    const imovel = await Imovel.buscarPorId(imovel_id);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado' });
    }
    if (imovel.status !== 'disponivel') {
      return res.status(400).json({ erro: 'Imóvel não está disponível' });
    }

    const transacao = await Transacao.criar({
      imovel_id,
      cliente_id,
      corretor_id: req.userId,
      tipo,
      valor,
      data_inicio,
      data_fim,
      contrato_url,
      status: 'pendente'
    });

    // Atualiza status do imóvel
    await Imovel.atualizar(imovel_id, { 
      status: tipo === 'venda' ? 'vendido' : 'alugado' 
    });

    res.status(201).json(transacao);
  } catch (error) {
    next(error);
  }
};

export const atualizarTransacao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, contrato_url } = req.body;
    
    const transacao = await Transacao.buscarPorId(id);
    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    // Apenas corretor responsável ou admin podem atualizar
    if (req.userTipo !== 'admin' && req.userId !== transacao.corretor_id) {
      return res.status(403).json({ erro: 'Sem permissão para atualizar esta transação' });
    }

    const transacaoAtualizada = await Transacao.atualizar(id, {
      status,
      contrato_url
    });

    // Se a transação for cancelada, volta o status do imóvel para disponível
    if (status === 'cancelado') {
      await Imovel.atualizar(transacao.imovel_id, { status: 'disponivel' });
    }

    res.json(transacaoAtualizada);
  } catch (error) {
    next(error);
  }
};

export const deletarTransacao = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Apenas admin pode deletar
    if (req.userTipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para deletar transações' });
    }

    const transacao = await Transacao.buscarPorId(id);
    if (!transacao) {
      return res.status(404).json({ erro: 'Transação não encontrada' });
    }

    await Transacao.deletar(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const estatisticasTransacoes = async (req, res, next) => {
  try {
    const stats = await Transacao.estatisticas();
    res.json(stats);
  } catch (error) {
    next(error);
  }
}; 