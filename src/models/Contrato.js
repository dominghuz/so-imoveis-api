import { z } from 'zod';

export const ContratoSchema = z.object({
  imovel_id: z.string().uuid("ID do imóvel inválido"),
  cliente_id: z.string().uuid("ID do cliente inválido"),
  tipo: z.enum(['VENDA', 'ALUGUEL'], {
    errorMap: () => ({ message: "Tipo deve ser VENDA ou ALUGUEL" })
  }),
  valor: z.number()
    .positive("Valor deve ser maior que zero")
    .multipleOf(0.01, "Valor deve ter no máximo 2 casas decimais"),
  data_inicio: z.string().datetime("Data de início inválida"),
  data_fim: z.string().datetime("Data de fim inválida").optional(),
  status: z.enum(['PENDENTE', 'ATIVO', 'FINALIZADO', 'CANCELADO'], {
    errorMap: () => ({ message: "Status inválido" })
  }).default('PENDENTE'),
  observacoes: z.string().optional(),
  arquivo_url: z.string().url("URL do arquivo inválida").optional()
}); 