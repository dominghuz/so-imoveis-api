const connection = require('../database/connection');

class Transacao {
  static async criar(dados) {
    return await connection('transacoes').insert(dados);
  }

  static async listar() {
    return await connection('transacoes')
      .join('imoveis', 'transacoes.imovel_id', '=', 'imoveis.id')
      .join('usuarios as comprador', 'transacoes.comprador_id', '=', 'comprador.id')
      .join('usuarios as vendedor', 'transacoes.vendedor_id', '=', 'vendedor.id')
      .select(
        'transacoes.*',
        'imoveis.titulo as imovel',
        'comprador.nome as comprador',
        'vendedor.nome as vendedor'
      );
  }

  static async buscarPorId(id) {
    return await connection('transacoes')
      .where('transacoes.id', id)
      .join('imoveis', 'transacoes.imovel_id', '=', 'imoveis.id')
      .join('usuarios as comprador', 'transacoes.comprador_id', '=', 'comprador.id')
      .join('usuarios as vendedor', 'transacoes.vendedor_id', '=', 'vendedor.id')
      .select(
        'transacoes.*',
        'imoveis.titulo as imovel',
        'comprador.nome as comprador',
        'vendedor.nome as vendedor'
      )
      .first();
  }
}

module.exports = Transacao; 