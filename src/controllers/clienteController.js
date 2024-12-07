import Cliente from '../models/Cliente.js';
import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

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

    // Busca clientes com dados do usuário relacionado
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
    // Busca cliente com dados do usuário relacionado
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
    const {
      // Dados do usuário
      email,
      nome,
      telefone,
      senha,
      // Dados do cliente
      bi,
      data_nascimento,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      profissao,
      renda_mensal,
      interesse,
      tipo_imovel_interesse,
      observacoes
    } = req.body;

    // Validações básicas
    if (!email || !nome || !telefone || !senha || !bi) {
      return res.status(400).json({ 
        erro: 'Dados obrigatórios não fornecidos',
        camposNecessarios: ['email', 'nome', 'telefone', 'senha', 'bi']
      });
    }

    // Verificar se já existe usuário com mesmo email
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Verificar se já existe cliente com mesmo BI
    const clienteExistente = await Cliente.buscarPorBi(bi);
    if (clienteExistente) {
      return res.status(400).json({ erro: 'BI já cadastrado' });
    }

    // Criar usuário primeiro
    const hashSenha = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar({
      email,
      nome,
      telefone,
      senha: hashSenha,
      tipo: 'cliente'
    });

    // Criar cliente associado ao usuário
    const cliente = await Cliente.criar({
      usuario_id: usuario.id,
      bi,
      data_nascimento,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      profissao,
      renda_mensal,
      interesse,
      tipo_imovel_interesse,
      observacoes
    });

    // Retornar cliente com dados do usuário
    const clienteCompleto = await Cliente.buscarPorId(cliente.id);
    res.status(201).json(clienteCompleto);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    next(error);
  }
};

export const atualizarCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      // Dados do usuário
      email,
      nome,
      telefone,
      // Dados do cliente
      bi,
      data_nascimento,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      profissao,
      renda_mensal,
      interesse,
      tipo_imovel_interesse,
      observacoes
    } = req.body;
    
    // Verificar se o cliente existe
    const clienteExistente = await Cliente.buscarPorId(id);
    if (!clienteExistente) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    // Verificar BI duplicado
    if (bi && bi !== clienteExistente.bi) {
      const biExistente = await Cliente.buscarPorBi(bi);
      if (biExistente) {
        return res.status(400).json({ erro: 'BI já cadastrado' });
      }
    }

    // Atualizar dados do usuário se fornecidos
    if (email || nome || telefone) {
      const dadosUsuario = {};
      if (email) dadosUsuario.email = email;
      if (nome) dadosUsuario.nome = nome;
      if (telefone) dadosUsuario.telefone = telefone;

      await Usuario.atualizar(clienteExistente.usuario_id, dadosUsuario);
    }

    // Atualizar dados do cliente
    const dadosCliente = {
      bi,
      data_nascimento,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      profissao,
      renda_mensal,
      interesse,
      tipo_imovel_interesse,
      observacoes
    };

    // Remover campos undefined
    Object.keys(dadosCliente).forEach(key => 
      dadosCliente[key] === undefined && delete dadosCliente[key]
    );

    const clienteAtualizado = await Cliente.atualizar(id, dadosCliente);
    
    // Retornar cliente atualizado com dados do usuário
    const clienteCompleto = await Cliente.buscarPorId(clienteAtualizado.id);
    res.json(clienteCompleto);
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

    // Não precisamos deletar o usuário explicitamente devido ao CASCADE
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

export const meuPerfil = async (req, res, next) => {
  try {
    // Busca o cliente pelo ID do usuário logado
    const cliente = await Cliente.buscarPorUsuarioId(req.usuario.id);
    
    if (!cliente) {
      return res.status(404).json({ erro: 'Perfil de cliente não encontrado' });
    }

    // Busca dados completos (incluindo dados do usuário)
    const perfilCompleto = await Cliente.buscarPorId(cliente.id);
    
    res.json(perfilCompleto);
  } catch (error) {
    next(error);
  }
};

export const atualizarMeuPerfil = async (req, res, next) => {
  try {
    const {
      // Dados do usuário
      email,
      nome,
      telefone,
      senha,
      // Dados do cliente
      bi,
      data_nascimento,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      profissao,
      renda_mensal,
      interesse,
      tipo_imovel_interesse,
      observacoes
    } = req.body;

    // Busca o cliente pelo ID do usuário logado
    const cliente = await Cliente.buscarPorUsuarioId(req.usuario.id);
    
    if (!cliente) {
      return res.status(404).json({ erro: 'Perfil de cliente não encontrado' });
    }

    // Verificar BI duplicado se estiver sendo alterado
    if (bi && bi !== cliente.bi) {
      const biExistente = await Cliente.buscarPorBi(bi);
      if (biExistente) {
        return res.status(400).json({ erro: 'BI já cadastrado' });
      }
    }

    // Atualizar dados do usuário se fornecidos
    if (email || nome || telefone || senha) {
      const dadosUsuario = {};
      if (email) dadosUsuario.email = email;
      if (nome) dadosUsuario.nome = nome;
      if (telefone) dadosUsuario.telefone = telefone;
      if (senha) {
        dadosUsuario.senha = await bcrypt.hash(senha, 10);
      }

      await Usuario.atualizar(req.usuario.id, dadosUsuario);
    }

    // Atualizar dados do cliente
    const dadosCliente = {
      bi,
      data_nascimento,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      profissao,
      renda_mensal,
      interesse,
      tipo_imovel_interesse,
      observacoes
    };

    // Remover campos undefined
    Object.keys(dadosCliente).forEach(key => 
      dadosCliente[key] === undefined && delete dadosCliente[key]
    );

    const clienteAtualizado = await Cliente.atualizar(cliente.id, dadosCliente);
    
    // Retornar perfil atualizado com dados do usuário
    const perfilCompleto = await Cliente.buscarPorId(clienteAtualizado.id);
    res.json(perfilCompleto);
  } catch (error) {
    next(error);
  }
}; 