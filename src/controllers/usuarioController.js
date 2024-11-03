import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

export const listarUsuarios = async (req, res, next) => {
  try {
    const { tipo } = req.query;
    const usuarios = await Usuario.listar(tipo);
    
    // Remove o campo senha dos resultados
    const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario);
    
    res.json(usuariosSemSenha);
  } catch (error) {
    next(error);
  }
};

export const buscarUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.buscarPorId(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Remove o campo senha
    const { senha, ...usuarioSemSenha } = usuario;
    
    res.json(usuarioSemSenha);
  } catch (error) {
    next(error);
  }
};

export const criarUsuario = async (req, res, next) => {
  try {
    const { nome, email, senha, telefone, tipo = 'cliente' } = req.body;

    // Verifica se já existe algum usuário no sistema
    const totalUsuarios = await Usuario.contar();

    // Se não houver usuários, permite criar o primeiro admin
    // Caso contrário, verifica as permissões
    // if (totalUsuarios > 0 && tipo !== 'cliente' && (!req.userTipo || req.userTipo !== 'admin')) {
    //   return res.status(403).json({ erro: 'Sem permissão para criar este tipo de usuário' });
    // }

    // Verifica se o email já existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const usuario = await Usuario.criar({
      nome,
      email,
      senha: senhaCriptografada,
      telefone,
      tipo
    });

    // Remove o campo senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    next(error);
  }
};

export const atualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, telefone, tipo } = req.body;

    // Verifica se o usuário existe
    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Verifica permissões
    if (req.userId !== parseInt(id) && req.userTipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para atualizar este usuário' });
    }

    // Se não for admin, não pode mudar o tipo
    if (tipo && tipo !== usuario.tipo && req.userTipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para alterar o tipo de usuário' });
    }

    const dados = { nome, email, telefone, tipo };

    // Se foi enviada uma nova senha, criptografa
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      dados.senha = await bcrypt.hash(senha, salt);
    }

    const usuarioAtualizado = await Usuario.atualizar(id, dados);
    
    // Remove o campo senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

    res.json(usuarioSemSenha);
  } catch (error) {
    next(error);
  }
};

export const deletarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Apenas admin pode deletar usuários
    if (req.userTipo !== 'admin') {
      return res.status(403).json({ erro: 'Sem permissão para deletar usuários' });
    }

    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await Usuario.deletar(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 