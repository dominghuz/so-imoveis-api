import supabase from '../config/supabase.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      const error = new Error('Token não fornecido');
      error.status = 401;
      throw error;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      const authError = new Error('Não autorizado');
      authError.status = 401;
      throw authError;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}; 