import connection from '../database/connection.js';

class Agendamento {
  static async criar(dados) {
    const [id] = await connection('agendamentos').insert(dados);
    return this.buscarPorId(id);
  }

  static async listar(filtros = {}) {
    let query = connection('agendamentos')
      .join('imoveis', 'agendamentos.imovel_id', '=', 'imoveis.id')
      .join('usuarios as cliente', 'agendamentos.cliente_id', '=', 'cliente.id')
      .join('usuarios as corretor', 'agendamentos.corretor_id', '=', 'corretor.id')
      .select(
        'agendamentos.*',
        'imoveis.tipo as imovel_tipo',
        'imoveis.rua as imovel_rua',
        'imoveis.numero as imovel_numero',
        'imoveis.bairro as imovel_bairro',
        'imoveis.cidade as imovel_cidade',
        'cliente.nome as cliente_nome',
        'corretor.nome as corretor_nome'
      );

    // Aplicar filtros
    if (filtros.data) {
      query = query.where('agendamentos.data', filtros.data);
    }

    if (filtros.status) {
      query = query.where('agendamentos.status', filtros.status);
    }

    if (filtros.corretor_id) {
      query = query.where('agendamentos.corretor_id', filtros.corretor_id);
    }

    if (filtros.cliente_id) {
      query = query.where('agendamentos.cliente_id', filtros.cliente_id);
    }

    if (filtros.imovel_id) {
      query = query.where('agendamentos.imovel_id', filtros.imovel_id);
    }

    // Aplicar paginação se fornecida
    if (filtros.limit && filtros.offset !== undefined) {
      query = query.limit(filtros.limit).offset(filtros.offset);
    }

    // Ordenar por data e hora
    query = query.orderBy([
      { column: 'agendamentos.data', order: 'asc' },
      { column: 'agendamentos.hora', order: 'asc' }
    ]);

    return query;
  }

  static async contar(filtros = {}) {
    let query = connection('agendamentos')
      .count('* as total')
      .first();

    // Aplicar os mesmos filtros da listagem
    if (filtros.data) {
      query = query.where('data', filtros.data);
    }

    if (filtros.status) {
      query = query.where('status', filtros.status);
    }

    if (filtros.corretor_id) {
      query = query.where('corretor_id', filtros.corretor_id);
    }

    if (filtros.cliente_id) {
      query = query.where('cliente_id', filtros.cliente_id);
    }

    if (filtros.imovel_id) {
      query = query.where('imovel_id', filtros.imovel_id);
    }

    const result = await query;
    return result.total;
  }

  static async buscarPorId(id) {
    return await connection('agendamentos')
      .where('agendamentos.id', id)
      .join('imoveis', 'agendamentos.imovel_id', '=', 'imoveis.id')
      .join('usuarios as cliente', 'agendamentos.cliente_id', '=', 'cliente.id')
      .join('usuarios as corretor', 'agendamentos.corretor_id', '=', 'corretor.id')
      .select(
        'agendamentos.*',
        'imoveis.tipo as imovel_tipo',
        'imoveis.rua as imovel_rua',
        'imoveis.numero as imovel_numero',
        'imoveis.bairro as imovel_bairro',
        'imoveis.cidade as imovel_cidade',
        'cliente.nome as cliente_nome',
        'corretor.nome as corretor_nome'
      )
      .first();
  }

  static async atualizar(id, dados) {
    await connection('agendamentos')
      .where({ id })
      .update({
        ...dados,
        updated_at: connection.fn.now()
      });

    return this.buscarPorId(id);
  }

  static async deletar(id) {
    return await connection('agendamentos')
      .where({ id })
      .del();
  }

  // Métodos auxiliares
  static async verificarDisponibilidade(data, hora, corretor_id) {
    const agendamentos = await connection('agendamentos')
      .where({
        data,
        hora,
        corretor_id,
        status: 'confirmado'
      })
      .count('* as total');

    return agendamentos[0].total === 0;
  }

  static async listarPorPeriodo(dataInicio, dataFim, corretor_id = null) {
    let query = connection('agendamentos')
      .whereBetween('data', [dataInicio, dataFim]);

    if (corretor_id) {
      query = query.where('corretor_id', corretor_id);
    }

    return query.orderBy(['data', 'hora']);
  }
}

export default Agendamento; 