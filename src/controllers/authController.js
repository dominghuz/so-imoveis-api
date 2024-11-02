import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário pelo email
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retornar dados do usuário e token
    const { senha: _, ...usuarioSemSenha } = usuario;
    return res.json({
      usuario: usuarioSemSenha,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro no login' });
  }
};

export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se usuário já existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criptografar senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Criar usuário
    const usuario = await Usuario.criar({
      nome,
      email,
      senha: senhaCriptografada
    });

    // Gerar token
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retornar dados do usuário e token
    const { senha: _, ...usuarioSemSenha } = usuario;
    return res.status(201).json({
      usuario: usuarioSemSenha,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro no cadastro' });
  }
}; 