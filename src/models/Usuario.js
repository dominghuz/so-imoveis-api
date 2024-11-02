import connection from '../database/connection.js';

class Usuario {
  static async criar(dados) {
    const [id] = await connection('usuarios').insert(dados);
    return this.buscarPorId(id);
  }

  static async buscarPorEmail(email) {
    return await connection('usuarios')
      .where({ email })
      .first();
  }

  static async buscarPorId(id) {
    return await connection('usuarios')
      .where({ id })
      .first();
  }

  static async listar() {
    return await connection('usuarios')
      .select('*');
  }

  static async atualizar(id, dados) {
    await connection('usuarios')
      .where({ id })
      .update(dados);
    return this.buscarPorId(id);
  }

  static async deletar(id) {
    return await connection('usuarios')
      .where({ id })
      .del();
  }
}

export default Usuario; 