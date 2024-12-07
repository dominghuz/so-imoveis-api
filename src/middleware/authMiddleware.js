import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const authMiddleware = (tiposPermitidos = []) => async (req, res, next) => {
  try {
    // 1. Verificar existência do header de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Token não fornecido no header');
      return res.status(401).json({ 
        erro: 'Token não fornecido',
        detalhes: 'É necessário fornecer um token de autenticação' 
      });
    }

    // 2. Verificar formato do token (Bearer token)
    const [bearer, token] = authHeader.split(' ');
    if (!token || bearer !== 'Bearer') {
      console.log('Formato do token inválido:', authHeader);
      return res.status(401).json({ 
        erro: 'Token mal formatado',
        detalhes: 'O token deve estar no formato: Bearer <token>' 
      });
    }

    try {
      // 3. Verificar e decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.id) {
        throw new Error('Token não contém ID do usuário');
      }

      // 4. Buscar usuário no banco
      const usuario = await Usuario.buscarPorId(decoded.id);
      if (!usuario) {
        return res.status(401).json({ 
          erro: 'Usuário não encontrado',
          detalhes: 'O usuário associado ao token não existe mais' 
        });
      }

      // 5. Verificar permissões (se necessário)
      if (tiposPermitidos.length > 0 && !tiposPermitidos.includes(usuario.tipo)) {
        console.log(`Acesso negado para usuário ${usuario.id} (${usuario.tipo}). Tipos permitidos: ${tiposPermitidos.join(', ')}`);
        return res.status(403).json({ 
          erro: 'Acesso não autorizado',
          detalhes: `Apenas usuários do tipo ${tiposPermitidos.join(', ')} têm acesso` 
        });
      }

      // 6. Adicionar informações do usuário ao request
      req.usuario = usuario;
      req.userId = usuario.id;
      req.userTipo = usuario.tipo;

      return next();

    } catch (tokenError) {
      console.error('Erro ao verificar token:', tokenError);
      return res.status(401).json({ 
        erro: 'Token inválido',
        detalhes: tokenError.message || 'O token fornecido é inválido ou expirou' 
      });
    }

  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      erro: 'Erro interno',
      detalhes: 'Ocorreu um erro ao processar a autenticação' 
    });
  }
}; 