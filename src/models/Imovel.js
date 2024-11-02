import connection from '../database/connection.js';

class Imovel {
  static async criar(dados) {
    const [id] = await connection('imoveis').insert(dados);
    return this.buscarPorId(id);
  }

  static async listar({ 
    tipo,
    finalidade,
    cidade,
    bairro,
    preco_min,
    preco_max,
    quartos_min,
    vagas_min,
    status,
    destaque,
    limit = 10,
    offset = 0 
  } = {}) {
    let query = connection('imoveis')
      .join('usuarios', 'imoveis.corretor_id', '=', 'usuarios.id')
      .select('imoveis.*', 'usuarios.nome as corretor')
      .limit(limit)
      .offset(offset);

    if (tipo) {
      query = query.where('tipo', tipo);
    }

    if (finalidade) {
      query = query.where('finalidade', finalidade);
    }

    if (cidade) {
      query = query.where('cidade', 'like', `%${cidade}%`);
    }

    if (bairro) {
      query = query.where('bairro', 'like', `%${bairro}%`);
    }

    if (preco_min) {
      query = query.where('preco', '>=', preco_min);
    }

    if (preco_max) {
      query = query.where('preco', '<=', preco_max);
    }

    if (quartos_min) {
      query = query.where('quartos', '>=', quartos_min);
    }

    if (vagas_min) {
      query = query.where('vagas', '>=', vagas_min);
    }

    if (status) {
      query = query.where('status', status);
    }

    if (destaque !== undefined) {
      query = query.where('destaque', destaque);
    }

    return query;
  }

  static async contar({ 
    tipo,
    finalidade,
    cidade,
    bairro,
    preco_min,
    preco_max,
    quartos_min,
    vagas_min,
    status,
    destaque 
  } = {}) {
    let query = connection('imoveis').count('* as count');

    if (tipo) {
      query = query.where('tipo', tipo);
    }

    if (finalidade) {
      query = query.where('finalidade', finalidade);
    }

    if (cidade) {
      query = query.where('cidade', 'like', `%${cidade}%`);
    }

    if (bairro) {
      query = query.where('bairro', 'like', `%${bairro}%`);
    }

    if (preco_min) {
      query = query.where('preco', '>=', preco_min);
    }

    if (preco_max) {
      query = query.where('preco', '<=', preco_max);
    }

    if (quartos_min) {
      query = query.where('quartos', '>=', quartos_min);
    }

    if (vagas_min) {
      query = query.where('vagas', '>=', vagas_min);
    }

    if (status) {
      query = query.where('status', status);
    }

    if (destaque !== undefined) {
      query = query.where('destaque', destaque);
    }

    return query;
  }

  static async buscarPorId(id) {
    return await connection('imoveis')
      .where('imoveis.id', id)
      .join('usuarios', 'imoveis.corretor_id', '=', 'usuarios.id')
      .select('imoveis.*', 'usuarios.nome as corretor')
      .first();
  }

  static async atualizar(id, dados) {
    await connection('imoveis').where({ id }).update(dados);
    return this.buscarPorId(id);
  }

  static async deletar(id) {
    return await connection('imoveis').where({ id }).del();
  }

  static async verificarEstrutura() {
    try {
      const colunas = await connection.table('imoveis').columnInfo();
      console.log('Estrutura da tabela imoveis:', colunas);
      return colunas;
    } catch (error) {
      console.error('Erro ao verificar estrutura:', error);
      throw error;
    }
  }
}

export default Imovel; 