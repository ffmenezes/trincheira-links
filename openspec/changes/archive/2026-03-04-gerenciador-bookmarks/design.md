## Context

Desenvolver um sistema de gerenciamento de bookmarks compartilhado para grupos privados, priorizando performance e minimalismo. O sistema deve funcionar principalmente em páginas estáticas com Astro, com opção de backend PostgreSQL para funcionalidades avançadas.

## Goals / Non-Goals

**Goals:**
- Sistema extremamente rápido e leve
- Funcionamento 100% estático com Astro (se possível)
- Busca textual livre e por tags eficiente
- Tema minimalista com cor verde bélica
- Suporte a bundles de links
- Armazenamento otimizado para performance

**Non-Goals:**
- Sistema de autenticação complexo
- Funcionalidades avançadas de edição colaborativa
- Suporte a múltiplos usuários com permissões diferentes
- Sincronização em tempo real

## Decisions

- **Framework Frontend:** Astro (páginas estáticas com performance otimizada)
- **Armazenamento Principal:** Arquivos JSON estáticos (se performance permitir)
- **Backend Secundário:** PostgreSQL apenas se necessário para busca complexa
- **Sistema de Busca:** Implementação customizada com índices otimizados
- **Tema:** Minimalista com CSS customizado em verde bélico
- **Cache:** Service Worker para offline e performance

## Risks / Trade-offs

- [Performance com arquivos estáticos grandes] → Implementar paginação e lazy loading
- [Busca complexa em arquivos estáticos] → Usar Web Workers para busca assíncrona
- [Limitações de Astro para funcionalidades dinâmicas] → Migrar para PostgreSQL se necessário
- [Tamanho de favicons e ogthumbs] → Otimizar e usar CDN para assets