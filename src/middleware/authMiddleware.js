import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    // Pegar o token do header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    // O token vem como "Bearer <token>", então precisamos pegar apenas o token
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
      // Verificar se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adicionar o id do usuário decodificado à requisição
      req.userId = decoded.id;
      
      return next();
    } catch (error) {
      return res.status(401).json({ erro: 'Token inválido' });
    }
  } catch (error) {
    return res.status(500).json({ erro: 'Erro na autenticação' });
  }
}; 