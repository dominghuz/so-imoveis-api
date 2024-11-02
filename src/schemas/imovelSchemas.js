import Joi from 'joi';

export const ImovelSchema = Joi.object({
  tipo: Joi.string().required().messages({
    'string.empty': 'O tipo é obrigatório',
    'any.required': 'O tipo é obrigatório'
  }),
  finalidade: Joi.string().valid('venda', 'aluguel').required().messages({
    'string.empty': 'A finalidade é obrigatória',
    'any.required': 'A finalidade é obrigatória',
    'any.only': 'A finalidade deve ser venda ou aluguel'
  }),
  preco: Joi.number().positive().required().messages({
    'number.base': 'O preço deve ser um número',
    'number.positive': 'O preço deve ser positivo',
    'any.required': 'O preço é obrigatório'
  }),
  cidade: Joi.string().required(),
  bairro: Joi.string().required(),
  rua: Joi.string().required(),
  numero: Joi.string().allow(''),
  complemento: Joi.string().allow(''),
  metragem: Joi.number().positive().required(),
  vagas: Joi.number().integer().min(0).required(),
  quartos: Joi.number().integer().min(0).required(),
  banheiros: Joi.number().integer().min(0).required(),
  descricao: Joi.string().allow(''),
  status: Joi.string().valid('disponivel', 'vendido', 'alugado', 'reservado').default('disponivel'),
  destaque: Joi.boolean().default(false),
  imagem: Joi.string().required(),
  corretor_id: Joi.number().integer().positive()
});

export const ImovelUpdateSchema = Joi.object({
  tipo: Joi.string(),
  finalidade: Joi.string().valid('venda', 'aluguel'),
  preco: Joi.number().positive(),
  cidade: Joi.string(),
  bairro: Joi.string(),
  rua: Joi.string(),
  numero: Joi.string().allow(''),
  complemento: Joi.string().allow(''),
  metragem: Joi.number().positive(),
  vagas: Joi.number().integer().min(0),
  quartos: Joi.number().integer().min(0),
  banheiros: Joi.number().integer().min(0),
  descricao: Joi.string().allow(''),
  status: Joi.string().valid('disponivel', 'vendido', 'alugado', 'reservado'),
  destaque: Joi.boolean(),
  imagem: Joi.string(),
  corretor_id: Joi.number().integer().positive()
});

export const ImovelFilterSchema = Joi.object({
  tipo: Joi.string(),
  finalidade: Joi.string().valid('venda', 'aluguel'),
  cidade: Joi.string(),
  bairro: Joi.string(),
  preco_min: Joi.number().positive(),
  preco_max: Joi.number().positive(),
  quartos_min: Joi.number().integer().min(0),
  vagas_min: Joi.number().integer().min(0),
  status: Joi.string().valid('disponivel', 'vendido', 'alugado', 'reservado'),
  destaque: Joi.boolean()
}); 