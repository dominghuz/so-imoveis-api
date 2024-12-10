import connection from '../database/connection.js';

class Contrato {
  static async criar(dados) {
    try {
      const [id] = await connection('contratos').insert(dados);
      return this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      throw error;
    }
  }

  static async listar(filtros = {}) {
    try {
      let query = connection('contratos')
        .join('imoveis', 'contratos.imovel_id', '=', 'imoveis.id')
        .join('usuarios as cliente', 'contratos.cliente_id', '=', 'cliente.id')
        .join('usuarios as corretor', 'contratos.corretor_id', '=', 'corretor.id')
        .select(
          'contratos.*',
          'imoveis.tipo as imovel_tipo',
          'imoveis.titulo as imovel_titulo',
          'imoveis.preco as imovel_preco',
          'cliente.nome as cliente_nome',
          'cliente.email as cliente_email',
          'corretor.nome as corretor_nome',
          'corretor.email as corretor_email'
        );

      // Aplicar filtros
      if (filtros.tipo) {
        query = query.where('contratos.tipo', filtros.tipo);
      }

      if (filtros.status) {
        query = query.where('contratos.status', filtros.status);
      }

      if (filtros.corretor_id) {
        query = query.where('contratos.corretor_id', filtros.corretor_id);
      }

      if (filtros.cliente_id) {
        query = query.where('contratos.cliente_id', filtros.cliente_id);
      }

      // Paginação
      if (filtros.limit && filtros.offset !== undefined) {
        query = query.limit(filtros.limit).offset(filtros.offset);
      }

      return await query.orderBy('contratos.created_at', 'desc');
    } catch (error) {
      console.error('Erro ao listar contratos:', error);
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      return await connection('contratos')
        .where('contratos.id', id)
        .join('imoveis', 'contratos.imovel_id', '=', 'imoveis.id')
        .join('usuarios as cliente', 'contratos.cliente_id', '=', 'cliente.id')
        .join('usuarios as corretor', 'contratos.corretor_id', '=', 'corretor.id')
        .select(
          'contratos.*',
          'imoveis.tipo as imovel_tipo',
          'imoveis.titulo as imovel_titulo',
          'imoveis.preco as imovel_preco',
          'cliente.nome as cliente_nome',
          'cliente.email as cliente_email',
          'corretor.nome as corretor_nome',
          'corretor.email as corretor_email'
        )
        .first();
    } catch (error) {
      console.error('Erro ao buscar contrato:', error);
      throw error;
    }
  }

  static async atualizar(id, dados) {
    try {
      await connection('contratos')
        .where({ id })
        .update({
          ...dados,
          updated_at: connection.fn.now()
        });
      return this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error);
      throw error;
    }
  }

  static async deletar(id) {
    try {
      return await connection('contratos')
        .where({ id })
        .del();
    } catch (error) {
      console.error('Erro ao deletar contrato:', error);
      throw error;
    }
  }

  static async contar(filtros = {}) {
    try {
      let query = connection('contratos').count('* as total').first();

      if (filtros.tipo) {
        query = query.where('tipo', filtros.tipo);
      }

      if (filtros.status) {
        query = query.where('status', filtros.status);
      }

      const result = await query;
      return result.total;
    } catch (error) {
      console.error('Erro ao contar contratos:', error);
      throw error;
    }
  }
}

export default Contrato;