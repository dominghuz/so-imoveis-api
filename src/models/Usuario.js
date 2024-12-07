import connection from '../database/connection.js';

class Usuario {
  static async criar(dados) {
    try {
      const [id] = await connection('usuarios').insert(dados);
      return this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  static async buscarPorEmail(email) {
    try {
      const usuario = await connection('usuarios')
        .where({ email })
        .select('*')
        .first();
      
      return usuario;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  static async buscarPorId(id) {
    try {
      const usuario = await connection('usuarios')
        .where({ id })
        .select([
          'id',
          'nome',
          'email',
          'telefone',
          'tipo',
          'created_at',
          'updated_at'
        ])
        .first();

      if (!usuario) {
        throw new Error(`Usuário com ID ${id} não encontrado`);
      }

      return usuario;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  static async listar(tipo = null) {
    try {
      let query = connection('usuarios')
        .select([
          'id',
          'nome',
          'email',
          'telefone',
          'tipo',
          'created_at',
          'updated_at'
        ]);
      
      if (tipo) {
        query = query.where({ tipo });
      }
      
      return await query;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw new Error(`Erro ao listar usuários: ${error.message}`);
    }
  }

  static async atualizar(id, dados) {
    try {
      await connection('usuarios')
        .where({ id })
        .update({
          ...dados,
          updated_at: connection.fn.now()
        });
      return this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  static async deletar(id) {
    try {
      const resultado = await connection('usuarios')
        .where({ id })
        .del();
      return resultado > 0;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  static async verificarCredenciais(email, senha) {
    try {
      const usuario = await this.buscarPorEmail(email);
      if (!usuario) {
        return null;
      }
      return usuario;
    } catch (error) {
      console.error('Erro ao verificar credenciais:', error);
      throw new Error(`Erro ao verificar credenciais: ${error.message}`);
    }
  }
}

export default Usuario; 