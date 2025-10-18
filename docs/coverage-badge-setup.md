# Coverage Badge Setup Guide

Este documento explica como configurar o badge de cobertura de testes usando GitHub Actions e Gist.

## 🎯 Objetivo

Criar um badge dinâmico que mostra a porcentagem de cobertura de testes do projeto, atualizado automaticamente a cada push na branch principal.

## 📋 Pré-requisitos

Antes de começar, você precisa:

1. **Conta GitHub** com acesso ao repositório
2. **Permissão para criar GitHub Actions secrets**
3. **Permissão para criar Gists**

## 🔧 Configuração Passo a Passo

### Etapa 1: Criar um GitHub Gist

1. Acesse https://gist.github.com/
2. Clique em "Create new gist"
3. Configure o Gist:
   - **Filename:** `coverage-frontend.json`
   - **Content:**
     ```json
     {
       "schemaVersion": 1,
       "label": "Coverage",
       "message": "0%",
       "color": "red"
     }
     ```
   - Marque como **Public** (necessário para shields.io)
4. Clique em "Create public gist"
5. **Copie o Gist ID** da URL (exemplo: se a URL for `https://gist.github.com/username/abc123def456`, o ID é `abc123def456`)

### Etapa 2: Criar Personal Access Token (PAT)

1. Acesse https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Configure o token:
   - **Note:** `Coverage Badge Gist`
   - **Expiration:** Escolha o período desejado (recomendado: 1 ano)
   - **Scopes:** Marque apenas `gist` (permite criar e editar gists)
4. Clique em "Generate token"
5. **Copie o token imediatamente** (você não poderá vê-lo novamente!)

### Etapa 3: Adicionar Secrets ao Repositório

1. No seu repositório, vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em "New repository secret"
3. Adicione o primeiro secret:
   - **Name:** `GIST_SECRET`
   - **Value:** Cole o Personal Access Token criado na Etapa 2
   - Clique em "Add secret"
4. Adicione o segundo secret:
   - **Name:** `GIST_ID`
   - **Value:** Cole o Gist ID da Etapa 1
   - Clique em "Add secret"

### Etapa 4: Verificar Permissões do Workflow

1. No repositório, vá para **Settings** → **Actions** → **General**
2. Em "Workflow permissions", selecione:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Clique em "Save"

## 📝 Como Funciona

### Workflow (`test-coverage.yml`)

O workflow é acionado em:
- ✅ **Push** nas branches `main`, `master`, ou `develop`
- ✅ **Pull Requests** para essas branches
- ✅ **Manualmente** via GitHub UI (workflow_dispatch)

### Fluxo de Execução

1. **Checkout do código**
2. **Setup Node.js 20**
3. **Instalação de dependências** (`npm ci`)
4. **Execução dos testes** com cobertura (`npm run test:coverage`)
5. **Extração da porcentagem** de cobertura do arquivo `coverage/coverage-summary.json`
6. **Atualização do badge** (apenas em push para main/master)
7. **Comentário no PR** com resultado da cobertura (apenas em PRs)
8. **Upload do relatório** como artifact
9. **Verificação do threshold** (80%)

### Cores do Badge

O badge muda de cor automaticamente baseado na porcentagem:

| Cobertura | Cor |
|-----------|-----|
| 0-50% | 🔴 Vermelho |
| 50-70% | 🟠 Laranja |
| 70-80% | 🟡 Amarelo |
| 80-90% | 🟢 Verde claro |
| 90-100% | 🟢 Verde escuro |

## 🎨 Usando o Badge

### No README.md

Adicione o badge ao seu README usando a seguinte sintaxe:

```markdown
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/SEU_USERNAME/SEU_GIST_ID/raw/coverage-frontend.json)
```

**Substitua:**
- `SEU_USERNAME` pelo seu username do GitHub
- `SEU_GIST_ID` pelo ID do Gist criado na Etapa 1

### Exemplo Completo

```markdown
# Product Catalog Frontend

[![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/johndoe/abc123def456/raw/coverage-frontend.json)](./docs/testing-implementation-plan.md)
[![Tests](https://github.com/johndoe/product-catalog/workflows/Test%20Coverage/badge.svg)](https://github.com/johndoe/product-catalog/actions)
```

## 🔍 Verificação

Para verificar se tudo está funcionando:

1. **Faça um commit** na branch main
2. Vá para **Actions** no GitHub
3. Verifique se o workflow "Test Coverage" foi executado
4. Após a conclusão bem-sucedida:
   - O Gist deve estar atualizado com a nova porcentagem
   - O badge no README deve mostrar a cobertura atual

## 🐛 Troubleshooting

### Badge não atualiza

**Problema:** O badge mostra 0% ou valores antigos

**Soluções:**
1. Verifique se o workflow executou com sucesso
2. Confirme que os secrets `GIST_SECRET` e `GIST_ID` estão corretos
3. Verifique se o Gist é público
4. Limpe o cache do navegador (Ctrl+Shift+R)
5. Adicione `?cacheBust=TIMESTAMP` ao final da URL do badge

### Workflow falha na etapa "Update coverage badge"

**Problema:** Erro de autenticação ou permissão

**Soluções:**
1. Verifique se o PAT ainda é válido
2. Confirme que o PAT tem o scope `gist`
3. Verifique se o `GIST_ID` está correto
4. Certifique-se de que o Gist existe e é público

### Comentário no PR não aparece

**Problema:** Workflow não comenta no PR

**Soluções:**
1. Verifique se "Allow GitHub Actions to create and approve pull requests" está habilitado
2. Confirme que o workflow tem permissão `pull-requests: write` (se necessário)

## 📚 Recursos Adicionais

- [Dynamic Badges Action](https://github.com/schneegans/dynamic-badges-action)
- [Shields.io Documentation](https://shields.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Coverage](https://vitest.dev/guide/coverage.html)

## 🔄 Manutenção

### Renovar Token

Quando o PAT expirar:

1. Crie um novo token seguindo a Etapa 2
2. Atualize o secret `GIST_SECRET` com o novo valor

### Mudar Threshold

Para mudar o threshold de cobertura:

1. Edite `.github/workflows/test-coverage.yml`
2. Altere a variável `THRESHOLD=80` para o valor desejado
3. Faça commit da alteração

### Customizar Cores

Para ajustar os ranges de cores:

1. Edite `.github/workflows/test-coverage.yml`
2. Modifique os parâmetros:
   ```yaml
   maxColorRange: 90  # Cobertura máxima (verde escuro)
   minColorRange: 50  # Cobertura mínima (vermelho)
   ```

## ✅ Checklist de Configuração

Use este checklist para garantir que tudo foi configurado:

- [ ] Gist público criado com ID anotado
- [ ] Personal Access Token criado com scope `gist`
- [ ] Secret `GIST_SECRET` adicionado ao repositório
- [ ] Secret `GIST_ID` adicionado ao repositório
- [ ] Workflow permissions configuradas (Read and write)
- [ ] Badge adicionado ao README.md
- [ ] Primeiro workflow executado com sucesso
- [ ] Badge exibindo cobertura correta

---

**Última atualização:** Outubro 2025
**Versão:** 1.0
