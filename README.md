# SO-IMOVEIS-API

## Endpoints da API

### 1. Autenticação (/api/auth)
```
POST /auth/login
POST /auth/registro
```

### 2. Imóveis (/api/imoveis)
```
# Rotas Públicas
GET /imoveis                    - Lista imóveis (com filtros)
GET /imoveis/:id               - Busca imóvel específico
GET /imoveis/contar            - Conta imóveis (com filtros)

# Rotas Protegidas (Corretor/Admin)
POST /imoveis                  - Cria imóvel
PUT /imoveis/:id              - Atualiza imóvel
DELETE /imoveis/:id           - Remove imóvel
PATCH /imoveis/:id/destaque   - Altera destaque (Admin)
```

### 3. Clientes (/api/clientes)
```
# Rota Pública
POST /clientes                 - Registro de novo cliente

# Rotas do Cliente
GET /clientes/meu-perfil      - Ver próprio perfil
PUT /clientes/meu-perfil      - Atualizar próprio perfil

# Rotas Protegidas (Corretor/Admin)
GET /clientes                 - Lista clientes
GET /clientes/estatisticas    - Estatísticas de clientes
GET /clientes/:id            - Busca cliente específico
PUT /clientes/:id            - Atualiza cliente
DELETE /clientes/:id         - Remove cliente (Admin)
```

### 4. Agendamentos (/api/agendamentos)
```
# Rotas do Cliente
POST /agendamentos           - Criar agendamento

# Rotas Protegidas
GET /agendamentos           - Listar agendamentos
GET /agendamentos/periodo   - Listar por período
GET /agendamentos/:id       - Buscar agendamento
PUT /agendamentos/:id       - Atualizar agendamento (Corretor/Admin)
DELETE /agendamentos/:id    - Remover agendamento (Admin)
```

### 5. Contratos (/api/contratos)
```
# Rotas Protegidas
GET /contratos              - Listar contratos
GET /contratos/:id          - Buscar contrato
POST /contratos            - Criar contrato (Corretor)
PUT /contratos/:id         - Atualizar contrato (Corretor/Admin)
DELETE /contratos/:id      - Remover contrato (Admin)
GET /contratos/:id/pdf     - Gerar PDF do contrato
```

### 6. Transações (/api/transacoes)
```
# Rotas Protegidas
GET /transacoes            - Listar transações
GET /transacoes/estatisticas - Ver estatísticas
GET /transacoes/:id        - Buscar transação
POST /transacoes          - Criar transação (Corretor)
PUT /transacoes/:id       - Atualizar transação (Corretor/Admin)
DELETE /transacoes/:id    - Remover transação (Admin)
```

### 7. Métricas (/api/metricas)
```
# Rotas Protegidas (Corretor/Admin)
GET /metricas/dashboard           - Dashboard geral
GET /metricas/imoveis/dashboard   - Dashboard de imóveis
GET /metricas/imoveis/tipo        - Imóveis por tipo
GET /metricas/imoveis/status      - Imóveis por status
GET /metricas/comissoes           - Comissões por corretor
GET /metricas/conversao           - Conversão por corretor
GET /metricas/vendas              - Vendas por período
GET /metricas/locacoes            - Locações por período
GET /metricas/transacoes          - Transações por período
GET /metricas/visitas/imovel      - Visitas por imóvel
```

### 8. Usuários (/api/usuarios)
```
# Rotas Protegidas (Admin)
GET /usuarios              - Listar usuários
GET /usuarios/:id          - Buscar usuário
POST /usuarios            - Criar usuário
PUT /usuarios/:id         - Atualizar usuário
DELETE /usuarios/:id      - Remover usuário
```

## Observações:

1. **Autenticação:**
   - Rotas protegidas requerem token JWT válido
   - Token deve ser enviado no header: `Authorization: Bearer <token>`

2. **Permissões:**
   - Admin: acesso total
   - Corretor: acesso limitado aos seus recursos
   - Cliente: acesso apenas aos seus dados

3. **Paginação:**
   - Parâmetros: page (default: 1) e limit (default: 10)
   - Exemplo: ?page=1&limit=10

4. **Filtros:**
   - Disponíveis nas rotas de listagem
   - Enviados como query params
   - Exemplo: ?status=pendente&tipo=venda

5. **Respostas:**
   - Sucesso: status 2XX e dados
   - Erro: status 4XX/5XX e mensagem de erro