import connection from '../database/connection.js';

class Agendamento {
  static async criar(dados) {
    const [id] = await connection('agendamentos').insert(dados);
    return this.buscarPorId(id);
  }

  static async listar(filtros = {}) {
    try {
      let query = connection('agendamentos')
        .join('imoveis', 'agendamentos.imovel_id', '=', 'imoveis.id')
        .join('usuarios as cliente', 'agendamentos.cliente_id', '=', 'cliente.id')
        .join('usuarios as corretor', 'agendamentos.corretor_id', '=', 'corretor.id')
        .select(
          // Dados do agendamento
          'agendamentos.id',
          'agendamentos.data',
          'agendamentos.hora',
          'agendamentos.status',
          'agendamentos.observacoes',
          'agendamentos.created_at',
          'agendamentos.updated_at',
          
          // Dados básicos do imóvel
          'imoveis.id as imovel_id',
          'imoveis.tipo as imovel_tipo',
          
          // Dados do cliente
          'cliente.id as cliente_id',
          'cliente.nome as cliente_nome',
          'cliente.email as cliente_email',
          
          // Dados do corretor
          'corretor.id as corretor_id',
          'corretor.nome as corretor_nome',
          'corretor.email as corretor_email'
        );

      // Aplicar filtros
      if (filtros.data) {
        query = query.whereRaw('DATE(agendamentos.data) = ?', [filtros.data]);
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

      // Paginação
      if (filtros.limit && filtros.offset !== undefined) {
        query = query.limit(filtros.limit).offset(filtros.offset);
      }

      // Ordenação
      query = query.orderBy([
        { column: 'agendamentos.data', order: 'asc' },
        { column: 'agendamentos.hora', order: 'asc' }
      ]);

      const agendamentos = await query;
      
      // Log para debug
      console.log('Agendamentos encontrados:', agendamentos);
      
      return agendamentos;
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw error;
    }
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
    const agendamento = await connection('agendamentos')
      .where('agendamentos.id', id)
      .join('imoveis', 'agendamentos.imovel_id', '=', 'imoveis.id')
      .join('usuarios as cliente', 'agendamentos.cliente_id', '=', 'cliente.id')
      .join('usuarios as corretor', 'agendamentos.corretor_id', '=', 'corretor.id')
      .select(
        // Dados do agendamento
        'agendamentos.id',
        'agendamentos.data',
        'agendamentos.hora',
        'agendamentos.status',
        'agendamentos.observacoes',
        'agendamentos.created_at',
        'agendamentos.updated_at',
        
        // Dados básicos do imóvel
        'imoveis.id as imovel_id',
        'imoveis.tipo as imovel_tipo',
        
        // Dados do cliente
        'cliente.id as cliente_id',
        'cliente.nome as cliente_nome',
        'cliente.email as cliente_email',
        
        // Dados do corretor
        'corretor.id as corretor_id',
        'corretor.nome as corretor_nome',
        'corretor.email as corretor_email'
      )
      .first();

    return agendamento;
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    throw error;
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