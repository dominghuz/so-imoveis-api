import Joi from 'joi';

export const ImovelSchema = Joi.object({
  tipo: Joi.string().max(50).required().messages({
    'string.empty': 'O tipo é obrigatório',
    'string.max': 'O tipo deve ter no máximo 50 caracteres',
    'any.required': 'O tipo é obrigatório'
  }),
  titulo: Joi.string().max(200).required().messages({
    'string.empty': 'O título é obrigatório',
    'string.max': 'O título deve ter no máximo 200 caracteres',
    'any.required': 'O título é obrigatório'
  }),
  finalidade: Joi.string().valid('venda', 'aluguel').required().messages({
    'string.empty': 'A finalidade é obrigatória',
    'any.required': 'A finalidade é obrigatória',
    'any.only': 'A finalidade deve ser venda ou aluguel'
  }),
  preco: Joi.number().positive().precision(2).required().messages({
    'number.base': 'O preço deve ser um número',
    'number.positive': 'O preço deve ser positivo',
    'any.required': 'O preço é obrigatório'
  }),
  cidade: Joi.string().max(100).required().messages({
    'string.empty': 'A cidade é obrigatória',
    'string.max': 'A cidade deve ter no máximo 100 caracteres'
  }),
  bairro: Joi.string().max(100).required().messages({
    'string.empty': 'O bairro é obrigatório',
    'string.max': 'O bairro deve ter no máximo 100 caracteres'
  }),
  endereco: Joi.string().max(200).required().messages({
    'string.empty': 'O endereço é obrigatório',
    'string.max': 'O endereço deve ter no máximo 200 caracteres'
  }),
  numero: Joi.string().max(20).allow(''),
  complemento: Joi.string().max(100).allow(''),
  cep: Joi.string().length(8).required().messages({
    'string.empty': 'O CEP é obrigatório',
    'string.length': 'O CEP deve ter 8 caracteres'
  }),
  area: Joi.number().positive().precision(2).required().messages({
    'number.base': 'A área deve ser um número',
    'number.positive': 'A área deve ser positiva',
    'any.required': 'A área é obrigatória'
  }),
  vagas: Joi.number().integer().min(0).required().messages({
    'number.base': 'O número de vagas deve ser um número inteiro',
    'number.min': 'O número de vagas não pode ser negativo'
  }),
  quartos: Joi.number().integer().min(0).required().messages({
    'number.base': 'O número de quartos deve ser um número inteiro',
    'number.min': 'O número de quartos não pode ser negativo'
  }),
  banheiros: Joi.number().integer().min(0).required().messages({
    'number.base': 'O número de banheiros deve ser um número inteiro',
    'number.min': 'O número de banheiros não pode ser negativo'
  }),
  descricao: Joi.string().allow(''),
  status: Joi.string()
    .valid('disponivel', 'vendido', 'alugado', 'reservado')
    .default('disponivel'),
  destaque: Joi.boolean().default(false),
  imagem: Joi.string().max(255).required().messages({
    'string.empty': 'A imagem é obrigatória',
    'string.max': 'A URL da imagem deve ter no máximo 255 caracteres'
  }),
  corretor_id: Joi.number().integer().positive().required().messages({
    'number.base': 'O ID do corretor deve ser um número',
    'number.positive': 'O ID do corretor deve ser positivo',
    'any.required': 'O ID do corretor é obrigatório'
  })
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
  preco: Joi.number().positive(),
  quartos: Joi.number().integer().min(0),
  vagas: Joi.number().integer().min(0),
  status: Joi.string().valid('disponivel', 'vendido', 'alugado', 'reservado'),
  destaque: Joi.boolean()
}); 