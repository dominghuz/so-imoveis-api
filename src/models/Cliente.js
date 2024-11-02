import { z } from 'zod';

export const ClienteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100),
  bi: z.string().length(14, "BI deve ter 14 caracteres"),
  email: z.string().email("Email inválido").max(100),
  telefone: z.string().min(1, "Telefone é obrigatório").max(15),
  data_nascimento: z.coerce.date().optional(),
  endereco: z.string().max(200).optional(),
  bairro: z.string().max(100).optional(),
  cidade: z.string().max(100).optional(),
  estado: z.string().length(2, "Estado deve ter 2 caracteres").optional(),
  cep: z.string().max(9).optional(),
  profissao: z.string().max(100).optional(),
  renda_mensal: z.number()
    .positive("Renda mensal deve ser maior que zero")
    .multipleOf(0.01, "Renda mensal deve ter no máximo 2 casas decimais")
    .optional(),
  interesse: z.enum(['Compra', 'Aluguel', 'Ambos']).optional(),
  tipo_imovel_interesse: z.array(z.string()).optional(),
  observacoes: z.string().optional()
}); 