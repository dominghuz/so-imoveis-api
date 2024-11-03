import connection from '../database/connection.js';

class Transacao {
  static async criar(dados) {
    const [id] = await connection('transacoes').insert(dados);
    return this.buscarPorId(id);
  }

  static async listar(filtros = {}) {
    let query = connection('transacoes')
      .join('imoveis', 'transacoes.imovel_id', '=', 'imoveis.id')
      .join('usuarios as cliente', 'transacoes.cliente_id', '=', 'cliente.id')
      .join('usuarios as corretor', 'transacoes.corretor_id', '=', 'corretor.id')
      .select(
        'transacoes.*',
        'imoveis.tipo as imovel_tipo',
        'imoveis.rua as imovel_rua',
        'imoveis.numero as imovel_numero',
        'imoveis.cidade as imovel_cidade',
        'cliente.nome as cliente_nome',
        'corretor.nome as corretor_nome'
      );

    if (filtros.tipo) {
      query = query.where('transacoes.tipo', filtros.tipo);
    }

    if (filtros.status) {
      query = query.where('transacoes.status', filtros.status);
    }

    if (filtros.corretor_id) {
      query = query.where('transacoes.corretor_id', filtros.corretor_id);
    }

    if (filtros.cliente_id) {
      query = query.where('transacoes.cliente_id', filtros.cliente_id);
    }

    if (filtros.data_inicio) {
      query = query.where('transacoes.data_inicio', '>=', filtros.data_inicio);
    }

    if (filtros.data_fim) {
      query = query.where('transacoes.data_fim', '<=', filtros.data_fim);
    }

    // Aplicar paginação
    if (filtros.limit && filtros.offset !== undefined) {
      query = query.limit(filtros.limit).offset(filtros.offset);
    }

    return query.orderBy('transacoes.created_at', 'desc');
  }

  static async buscarPorId(id) {
    return await connection('transacoes')
      .where('transacoes.id', id)
      .join('imoveis', 'transacoes.imovel_id', '=', 'imoveis.id')
      .join('usuarios as cliente', 'transacoes.cliente_id', '=', 'cliente.id')
      .join('usuarios as corretor', 'transacoes.corretor_id', '=', 'corretor.id')
      .select(
        'transacoes.*',
        'imoveis.tipo as imovel_tipo',
        'imoveis.rua as imovel_rua',
        'imoveis.numero as imovel_numero',
        'imoveis.cidade as imovel_cidade',
        'cliente.nome as cliente_nome',
        'corretor.nome as corretor_nome'
      )
      .first();
  }

  static async atualizar(id, dados) {
    await connection('transacoes')
      .where({ id })
      .update(dados);
    return this.buscarPorId(id);
  }

  static async deletar(id) {
    return await connection('transacoes')
      .where({ id })
      .del();
  }

  static async contar(filtros = {}) {
    let query = connection('transacoes').count('* as total').first();

    if (filtros.tipo) {
      query = query.where('tipo', filtros.tipo);
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

    const result = await query;
    return result.total;
  }

  static async estatisticas() {
    const [totalVendas] = await connection('transacoes')
      .where({ tipo: 'venda', status: 'concluido' })
      .count('* as total');

    const [totalAlugueis] = await connection('transacoes')
      .where({ tipo: 'aluguel', status: 'concluido' })
      .count('* as total');

    const [valorTotalVendas] = await connection('transacoes')
      .where({ tipo: 'venda', status: 'concluido' })
      .sum('valor as total');

    const [valorTotalAlugueis] = await connection('transacoes')
      .where({ tipo: 'aluguel', status: 'concluido' })
      .sum('valor as total');

    const porStatus = await connection('transacoes')
      .select('status')
      .count('* as total')
      .groupBy('status');

    return {
      total_vendas: totalVendas.total,
      total_alugueis: totalAlugueis.total,
      valor_total_vendas: valorTotalVendas.total || 0,
      valor_total_alugueis: valorTotalAlugueis.total || 0,
      por_status: porStatus.reduce((acc, curr) => {
        acc[curr.status] = curr.total;
        return acc;
      }, {})
    };
  }
}

export default Transacao; 