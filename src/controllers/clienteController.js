import Cliente from '../models/Cliente.js';

export const listarClientes = async (req, res, next) => {
  try {
    const { 
      interesse,
      cidade,
      renda_min,
      renda_max,
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    const clientes = await Cliente.listar({
      interesse,
      cidade,
      renda_min,
      renda_max,
      limit: parseInt(limit),
      offset
    });

    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

export const buscarCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.buscarPorId(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

export const criarCliente = async (req, res, next) => {
  try {
    // Verificar se já existe cliente com mesmo BI ou email
    const clienteExistente = await Cliente.buscarPorBi(req.body.bi);
    if (clienteExistente) {
      return res.status(400).json({ erro: 'BI já cadastrado' });
    }

    const emailExistente = await Cliente.buscarPorEmail(req.body.email);
    if (emailExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const cliente = await Cliente.criar(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

export const atualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar se o cliente existe
    const clienteExistente = await Cliente.buscarPorId(id);
    if (!clienteExistente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    // Se estiver atualizando BI ou email, verificar se já existem
    if (req.body.bi && req.body.bi !== clienteExistente.bi) {
      const biExistente = await Cliente.buscarPorBi(req.body.bi);
      if (biExistente) {
        return res.status(400).json({ erro: 'BI já cadastrado' });
      }
    }

    if (req.body.email && req.body.email !== clienteExistente.email) {
      const emailExistente = await Cliente.buscarPorEmail(req.body.email);
      if (emailExistente) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
    }

    const clienteAtualizado = await Cliente.atualizar(id, req.body);
    res.json(clienteAtualizado);
  } catch (error) {
    next(error);
  }
};

export const deletarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.buscarPorId(id);
    if (!cliente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    await Cliente.deletar(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Endpoints para estatísticas
export const estatisticasClientes = async (req, res, next) => {
  try {
    const [
      porInteresse,
      porCidade
    ] = await Promise.all([
      Cliente.contarPorInteresse(),
      Cliente.contarPorCidade()
    ]);

    res.json({
      porInteresse,
      porCidade
    });
  } catch (error) {
    next(error);
  }
}; 