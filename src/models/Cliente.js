import connection from '../database/connection.js';

class Cliente {
  static async criar(dados) {
    // Se houver array de tipos de imóveis, converte para JSON string
    if (dados.tipo_imovel_interesse) {
      dados.tipo_imovel_interesse = JSON.stringify(dados.tipo_imovel_interesse);
    }

    const [id] = await connection('clientes').insert(dados);
    return this.buscarPorId(id);
  }

  static async listar(filtros = {}) {
    let query = connection('clientes')
      .select('*');

    // Aplicar filtros se fornecidos
    if (filtros.interesse) {
      query = query.where('interesse', filtros.interesse);
    }

    if (filtros.cidade) {
      query = query.where('cidade', 'like', `%${filtros.cidade}%`);
    }

    if (filtros.renda_min) {
      query = query.where('renda_mensal', '>=', filtros.renda_min);
    }

    if (filtros.renda_max) {
      query = query.where('renda_mensal', '<=', filtros.renda_max);
    }

    const clientes = await query;

    // Converter o campo tipo_imovel_interesse de JSON string para array
    return clientes.map(cliente => ({
      ...cliente,
      tipo_imovel_interesse: cliente.tipo_imovel_interesse 
        ? JSON.parse(cliente.tipo_imovel_interesse)
        : []
    }));
  }

  static async buscarPorId(id) {
    const cliente = await connection('clientes')
      .where({ id })
      .first();

    if (cliente && cliente.tipo_imovel_interesse) {
      cliente.tipo_imovel_interesse = JSON.parse(cliente.tipo_imovel_interesse);
    }

    return cliente;
  }

  static async buscarPorBi(bi) {
    return await connection('clientes')
      .where({ bi })
      .first();
  }

  static async buscarPorEmail(email) {
    return await connection('clientes')
      .where({ email })
      .first();
  }

  static async atualizar(id, dados) {
    // Se houver array de tipos de imóveis, converte para JSON string
    if (dados.tipo_imovel_interesse) {
      dados.tipo_imovel_interesse = JSON.stringify(dados.tipo_imovel_interesse);
    }

    await connection('clientes')
      .where({ id })
      .update({
        ...dados,
        updated_at: connection.fn.now()
      });

    return this.buscarPorId(id);
  }

  static async deletar(id) {
    return await connection('clientes')
      .where({ id })
      .del();
  }

  // Métodos auxiliares
  static async contarPorInteresse() {
    return await connection('clientes')
      .select('interesse')
      .count('* as total')
      .groupBy('interesse');
  }

  static async contarPorCidade() {
    return await connection('clientes')
      .select('cidade')
      .count('* as total')
      .groupBy('cidade');
  }
}

export default Cliente; 