import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: usuario.id,
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar token e dados básicos do usuário
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    next(error);
  }
};

export const registro = async (req, res, next) => {
  try {
    const { email, senha, nome, telefone, tipo = 'cliente' } = req.body;

    // Validação básica
    if (!email || !senha || !nome || !telefone) {
      return res.status(400).json({ 
        erro: 'Dados incompletos',
        camposNecessarios: ['email', 'senha', 'nome', 'telefone']
      });
    }

    // Verificar se email já existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criar usuário
    const hashSenha = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.criar({
      email,
      senha: hashSenha,
      nome,
      telefone,
      tipo
    });

    // Gerar token
    const token = jwt.sign(
      { 
        id: usuario.id,
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar token e dados do usuário
    res.status(201).json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    next(error);
  }
}; 