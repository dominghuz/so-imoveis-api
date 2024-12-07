import connection from '../database/connection.js';

class Cliente {
  static async criar(dados) {
    try {
      // Se houver array de tipos de imóveis, converte para JSON string
      if (dados.tipo_imovel_interesse) {
        dados.tipo_imovel_interesse = JSON.stringify(dados.tipo_imovel_interesse);
      }

      const [id] = await connection('clientes').insert(dados);
      return this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async listar(filtros = {}) {
    let query = connection('clientes')
      .select(
        'clientes.*',
        'usuarios.nome',
        'usuarios.email',
        'usuarios.telefone'
      )
      .join('usuarios', 'clientes.usuario_id', 'usuarios.id');

    // Aplicar filtros se fornecidos
    if (filtros.interesse) {
      query = query.where('clientes.interesse', filtros.interesse);
    }

    if (filtros.cidade) {
      query = query.where('clientes.cidade', 'like', `%${filtros.cidade}%`);
    }

    if (filtros.renda_min) {
      query = query.where('clientes.renda_mensal', '>=', filtros.renda_min);
    }

    if (filtros.renda_max) {
      query = query.where('clientes.renda_mensal', '<=', filtros.renda_max);
    }

    // Aplicar paginação
    if (filtros.limit && filtros.offset !== undefined) {
      query = query.limit(filtros.limit).offset(filtros.offset);
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
    try {
      const cliente = await connection('clientes')
        .select(
          'clientes.*',
          'usuarios.nome',
          'usuarios.email',
          'usuarios.telefone'
        )
        .join('usuarios', 'clientes.usuario_id', 'usuarios.id')
        .where('clientes.id', id)
        .first();

      if (cliente && cliente.tipo_imovel_interesse) {
        cliente.tipo_imovel_interesse = JSON.parse(cliente.tipo_imovel_interesse);
      }

      return cliente;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  static async buscarPorUsuarioId(usuario_id) {
    const cliente = await connection('clientes')
      .where({ usuario_id })
      .first();

    if (cliente && cliente.tipo_imovel_interesse) {
      cliente.tipo_imovel_interesse = JSON.parse(cliente.tipo_imovel_interesse);
    }

    return cliente;
  }

  static async buscarPorBi(bi) {
    try {
      return await connection('clientes')
        .where({ bi })
        .first();
    } catch (error) {
      console.error('Erro ao buscar cliente por BI:', error);
      throw error;
    }
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

  // Métodos para estatísticas
  static async contarPorInteresse() {
    return await connection('clientes')
      .select('interesse')
      .count('* as total')
      .groupBy('interesse');
  }

  static async contarPorCidade() {
    return await connection('clientes')
      .select('cidade')
      .whereNotNull('cidade')
      .count('* as total')
      .groupBy('cidade');
  }

  // Métodos auxiliares para validação
  static async verificarProprietario(clienteId, usuarioId) {
    const cliente = await connection('clientes')
      .select('usuario_id')
      .where({ id: clienteId })
      .first();

    return cliente && cliente.usuario_id === usuarioId;
  }

  static async totalClientes() {
    const [result] = await connection('clientes').count('* as total');
    return result.total;
  }
}

export default Cliente; 