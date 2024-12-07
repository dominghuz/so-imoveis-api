import connection from '../database/connection.js'; //importa a conexão com o banco de dados  

//modelo de imóveis
class Imovel {
  //função para criar um imóvel
  static async criar(dados) {
    try {
      // Validar se dados essenciais existem
      if (!dados) {
        throw new Error('Dados do imóvel não fornecidos');
      }

      // Inserir o imóvel e capturar o ID
      const [id] = await connection('imoveis').insert(dados).returning('id');
      
      // Verificar se o ID foi gerado
      if (!id) {
        throw new Error('Falha ao criar imóvel: ID não gerado');
      }

      // Buscar o imóvel criado
      const imovelCriado = await this.buscarPorId(id);
      
      // Verificar se o imóvel foi encontrado após criação
      if (!imovelCriado) {
        throw new Error('Imóvel com ID: '+ id + ' criado mas não encontrado');
      }

      return imovelCriado;
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      // Relançar o erro com uma mensagem mais específica
      throw new Error(`Erro ao criar imóvel: ${error.message}`);
    }
  }

  static async listar({ 
    tipo,
    finalidade,
    cidade,
    bairro,
    preco,
    quartos,
    vagas,
    status,
    destaque,
    limit = 10,
    offset = 0
  } = {}) {
    try {
      let query = connection('imoveis')
        .select(
          'imoveis.id',
          'imoveis.tipo',
          'imoveis.titulo',
          'imoveis.finalidade',
          'imoveis.preco',
          'imoveis.cidade',
          'imoveis.bairro',
          'imoveis.endereco',
          'imoveis.numero',
          'imoveis.complemento',
          'imoveis.cep',
          'imoveis.area',
          'imoveis.vagas',
          'imoveis.quartos',
          'imoveis.banheiros',
          'imoveis.descricao',
          'imoveis.status',
          'imoveis.destaque',
          'imoveis.imagem',
          'imoveis.created_at',
          'imoveis.updated_at',
          'usuarios.nome as corretor'
        )
        .join('usuarios', 'imoveis.corretor_id', '=', 'usuarios.id');

      // Aplicar filtros
      if (tipo) {
        query = query.where('imoveis.tipo', tipo);
      }

      if (finalidade) {
        query = query.where('imoveis.finalidade', finalidade);
      }

      if (cidade) {
        query = query.where('imoveis.cidade', 'like', `%${cidade}%`);
      }

      if (bairro) {
        query = query.where('imoveis.bairro', 'like', `%${bairro}%`);
      }

      if (preco) {
        query = query.where('imoveis.preco', '<=', preco);
      }

      if (quartos) {
        query = query.where('imoveis.quartos', quartos);
      }

      if (vagas) {
        query = query.where('imoveis.vagas', vagas);
      }

      if (status) {
        query = query.where('imoveis.status', status);
      }

      if (destaque !== undefined) {
        query = query.where('imoveis.destaque', destaque);
      }

      // Ordenação e paginação
      query = query
        .orderBy('imoveis.created_at', 'desc')
        .limit(limit)
        .offset(offset);

      console.log('Query SQL:', query.toString());

      return await query;
    } catch (error) {
      console.error('Erro ao listar imóveis:', error);
      throw new Error(`Erro ao listar imóveis: ${error.message}`);
    }
  }

  //função para contar os imóveis
  static async contar(filtros = {}) {
    try {
      let query = connection('imoveis')
        .count('* as count');

      // Aplica os filtros
      Object.entries(filtros).forEach(([campo, valor]) => {
        if (valor !== undefined) {
          if (campo === 'cidade' || campo === 'bairro') {
            query = query.where(campo, 'like', `%${valor}%`);
          } else {
            query = query.where(campo, valor);
          }
        }
      });

      console.log('Query de contagem:', query.toString());
      
      const resultado = await query;
      console.log('Resultado da query:', resultado);
      
      return resultado;
    } catch (error) {
      console.error('Erro ao contar imóveis:', error);
      throw new Error(`Erro ao contar imóveis: ${error.message}`);
    }
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
      // console.log('Estrutura da tabela imoveis:', colunas);
      return colunas;
    } catch (error) {
      console.error('Erro ao verificar estrutura:', error);
      throw error;
    }
  }
}

export default Imovel; 