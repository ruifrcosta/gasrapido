# Fluxo de Pedido do GasRápido

Documentação completa do fluxo de pedido, desde a solicitação do cliente até a certificação final.

## Visão Geral

O fluxo de pedido do GasRápido é composto por 5 etapas principais, cada uma com validações específicas, captura de dados e regras de negócio inteligentes.

## Etapas do Fluxo

### 1. Pedido do Cliente

**Ação:** Cliente seleciona tipo de botija, quantidade e endereço de entrega

**Validações:**
- Endereço válido e dentro da área de cobertura
- Método de pagamento definido

**Dados Capturados:**
- Tipo de botija
- Quantidade
- Localização
- Forma de pagamento

### 2. Confirmação de Disponibilidade (Fornecedor)

**Ação:** Fornecedor confirma se tem stock disponível

**Validações:**
- Verificação de stock em tempo real
- Condição inicial da botija

**Checklist do Fornecedor:**
- Etiqueta de validade visível
- Botija sem ferrugem ou danos estruturais
- Peso correto conforme especificação
- Válvula em bom estado

**Upload:**
- Fotografia da botija
- Fotografia do selo de segurança

**Resultado:**
- Confirmação positiva
- Rejeição (com motivo)

### 3. Despacho e Entrega

**Ação:** Entregador recolhe a botija e transporta até ao cliente

**Validações:**
- Rota otimizada (tempo máximo 30 minutos por célula)
- Condições climáticas consideradas
- Validação digital de saída do armazém

**Dados Capturados:**
- Hora de saída
- GPS em tempo real
- Identificação do entregador

### 4. Validação de Conformidade (Cliente na Entrega)

**Ação:** Cliente verifica se a botija recebida está em conformidade

**Checklist do Cliente:**
- Botija em bom estado físico
- Etiqueta de validade
- Selo de segurança intacto

**Upload:**
- Fotografia recebida (cliente pode tirar foto como prova)

**Resultado:**
- Aceitação da botija
- Reclamação (com motivo e evidência fotográfica)

### 5. Certificação Final

**Ação:** Sistema compila todas as evidências (fornecedor + entregador + cliente)

**Processo:**
- Armazenar todas as fotografias em servidor seguro
- Gerar certificado digital de conformidade
- Notificar cliente e fornecedor

**Dados Capturados:**
- ID do pedido
- Logs de checklist
- Provas fotográficas

## Inteligência do Sistema

### Regras Dinâmicas
- Se fornecedor não confirmar checklist, pedido não avança
- Se cliente rejeitar a botija, sistema abre ticket automático
- Se repetidas falhas de conformidade forem registadas, fornecedor é bloqueado automaticamente até auditoria

### IA de Suporte
- Analisar fotos automaticamente para validar etiquetas e selos
- Sugestão de rotas mais rápidas para o entregador
- Alertas automáticos para incidentes de segurança

## Segurança

- **Armazenamento:** Todas as evidências e fotos guardadas com encriptação AES-256
- **Logs:** Cada interação registada com carimbo de data e hora
- **Assinatura Digital:** Fornecedor, entregador e cliente validam digitalmente cada etapa