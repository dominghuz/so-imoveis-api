import { z } from 'zod';

export const AgendamentoSchema = z.object({
  imovel_id: z.string().uuid("ID do imóvel inválido"),
  cliente_id: z.string().uuid("ID do cliente inválido"),
  corretor_id: z.string().uuid("ID do corretor inválido"),
  data: z.coerce.date("Data inválida"),
  hora: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
  status: z.enum(['pendente', 'confirmado', 'cancelado', 'realizado'], {
    errorMap: () => ({ message: "Status inválido" })
  }).default('pendente'),
  observacoes: z.string().optional()
}); 