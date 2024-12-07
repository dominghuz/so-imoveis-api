# so-imoveis-api


### Rotas Públicas (Não requerem autenticação)

```markdown
1. Listar Imóveis
GET /imoveis
Query params opcionais:
- page (default: 1)
- limit (default: 10)
- tipo
- finalidade
- cidade
- bairro
- preco
- quartos
- vagas
- status
- destaque

2. Buscar Imóvel por ID
GET /imoveis/:id

3. Contar Imóveis
GET /imoveis/contar
Query params opcionais (mesmos filtros da listagem)
```


### Rotas Protegidas (Requerem autenticação)

```markdown
4. Criar Imóvel (Corretor/Admin)
POST /imoveis
Headers:
- Authorization: Bearer <token>
Body: {
  "tipo": "string",
  "titulo": "string",
  "finalidade": "string",
  "preco": number,
  "cidade": "string",
  "bairro": "string",
  "endereco": "string",
  "numero": "string",
  "complemento": "string",
  "cep": "string",
  "area": number,
  "vagas": number,
  "quartos": number,
  "banheiros": number,
  "descricao": "string",
  "status": "string",
  "destaque": boolean,
  "imagem": "string"
}

5. Atualizar Imóvel (Corretor/Admin)
PUT /imoveis/:id
Headers:
- Authorization: Bearer <token>
Body: {
  // campos a serem atualizados
}

6. Deletar Imóvel (Corretor/Admin)
DELETE /imoveis/:id
Headers:
- Authorization: Bearer <token>

7. Alterar Destaque (Apenas Admin)
PATCH /imoveis/:id/destaque
Headers:
- Authorization: Bearer <token>
Body: {
  "destaque": boolean
}
```


### Exemplos de Uso

```javascript
// 1. Listar imóveis com filtros
GET /imoveis?tipo=Apartamento&cidade=São Paulo&page=1&limit=10

// 2. Buscar imóvel específico
GET /imoveis/123

// 3. Contar imóveis com filtros
GET /imoveis/contar?tipo=Casa&cidade=Rio de Janeiro

// 4. Criar novo imóvel
POST /imoveis
Headers: {
  "Authorization": "Bearer seu_token_aqui",
  "Content-Type": "application/json"
}
Body: {
  "tipo": "Apartamento",
  "titulo": "Apartamento novo",
  ...
}

// 5. Atualizar imóvel
PUT /imoveis/123
Headers: {
  "Authorization": "Bearer seu_token_aqui",
  "Content-Type": "application/json"
}
Body: {
  "preco": 450000,
  "status": "vendido"
}

// 6. Deletar imóvel
DELETE /imoveis/123
Headers: {
  "Authorization": "Bearer seu_token_aqui"
}

// 7. Alterar destaque
PATCH /imoveis/123/destaque
Headers: {
  "Authorization": "Bearer seu_token_aqui",
  "Content-Type": "application/json"
}
Body: {
  "destaque": true
}
```

### Observações:
Todas as rotas protegidas requerem um token JWT válido
Os corretores só podem manipular seus próprios imóveis
Apenas admins podem alterar o status de destaque
As rotas de listagem suportam paginação e filtros
Erros retornam status HTTP apropriado e mensagem descritiva