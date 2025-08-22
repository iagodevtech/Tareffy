# Task Evolution Analyzer - Tareffy

Este script Python analisa dados de evolução de tarefas do Tareffy e gera gráficos e relatórios detalhados para insights de projeto.

## Funcionalidades

- 📊 **Gráficos de Evolução Mensal**: Visualização da evolução de tarefas ao longo do tempo
- 📈 **Conclusão Diária**: Acompanhamento de tarefas concluídas por dia
- 🎯 **Distribuição por Prioridade**: Análise da distribuição de tarefas por prioridade
- 📋 **Distribuição por Status**: Visão geral do status das tarefas
- ⚡ **Métricas de Produtividade**: Análise de velocidade, precisão de estimativas e métricas-chave
- 👥 **Performance da Equipe**: Análise da produtividade individual dos membros
- 📝 **Relatório de Insights**: Geração automática de relatório com recomendações

## Instalação

1. **Instale as dependências Python**:
```bash
pip install -r requirements.txt
```

2. **Certifique-se de que o backend do Tareffy está rodando** (opcional, se quiser usar dados reais)

## Uso

### Com dados reais da API

```bash
python task_evolution_analyzer.py --project-id "demo-project-1" --token "seu_token_aqui"
```

### Com dados de exemplo (para demonstração)

```bash
python task_evolution_analyzer.py --project-id "demo-project-1" --sample
```

### Parâmetros disponíveis

- `--project-id`: ID do projeto a ser analisado (obrigatório)
- `--api-url`: URL base da API (padrão: http://localhost:3001/api)
- `--token`: Token de acesso para autenticação na API
- `--sample`: Usar dados de exemplo em vez de buscar da API

## Saída

O script gera os seguintes arquivos na pasta `output/`:

### Gráficos
- `monthly_evolution.png`: Evolução mensal de tarefas
- `daily_completion.png`: Conclusão diária de tarefas
- `priority_distribution.png`: Distribuição por prioridade
- `status_distribution.png`: Distribuição por status
- `productivity_metrics.png`: Métricas de produtividade
- `team_performance.png`: Performance da equipe

### Relatórios
- `insights_report.md`: Relatório detalhado com insights e recomendações

## Exemplo de Uso

```bash
# Análise com dados reais
python task_evolution_analyzer.py \
  --project-id "demo-project-1" \
  --api-url "https://tareffy.iagodev.online/api" \
  --token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Análise com dados de exemplo
python task_evolution_analyzer.py \
  --project-id "demo-project-1" \
  --sample
```

## Estrutura dos Dados

O script espera os seguintes dados da API:

### Overview Data
```json
{
  "taskStats": [
    {"status": "COMPLETED", "count": 45},
    {"status": "IN_PROGRESS", "count": 12},
    {"status": "TODO", "count": 8},
    {"status": "IN_REVIEW", "count": 3}
  ],
  "completedThisMonth": 15,
  "hoursStats": {"estimated": 120, "actual": 95},
  "overdueTasks": 3,
  "dueThisWeek": 7,
  "memberProductivity": [...]
}
```

### Evolution Data
```json
{
  "monthlyEvolution": [
    {
      "month": "2024-01-01",
      "total_tasks": 25,
      "completed_tasks": 18,
      "in_progress_tasks": 4,
      "todo_tasks": 3,
      "review_tasks": 1
    }
  ],
  "dailyCompletion": [...],
  "priorityDistribution": [...]
}
```

## Personalização

Você pode personalizar o script modificando:

- **Cores dos gráficos**: Altere as constantes de cores no início do script
- **Estilo dos gráficos**: Modifique as configurações do matplotlib/seaborn
- **Métricas calculadas**: Adicione novas métricas na função `_generate_insights_report()`
- **Formato de saída**: Altere o formato dos gráficos ou relatórios

## Integração com o Dashboard

Este script complementa o dashboard web do Tareffy, oferecendo:

- **Análise offline**: Gere relatórios sem acesso à interface web
- **Gráficos de alta qualidade**: Imagens PNG de alta resolução para apresentações
- **Relatórios detalhados**: Análise textual com recomendações específicas
- **Automação**: Possibilidade de agendamento para relatórios periódicos

## Troubleshooting

### Erro de conexão com API
- Verifique se o backend está rodando
- Confirme a URL da API
- Verifique se o token de acesso é válido

### Erro de dependências
- Execute `pip install -r requirements.txt`
- Verifique se está usando Python 3.7+

### Gráficos não aparecem
- Verifique se a pasta `output/` foi criada
- Confirme permissões de escrita no diretório

## Contribuição

Para contribuir com melhorias no script:

1. Adicione novas funcionalidades de análise
2. Melhore a qualidade dos gráficos
3. Adicione novos tipos de relatórios
4. Otimize o desempenho para grandes volumes de dados

---

*Desenvolvido para o projeto Tareffy - Sistema de Gerenciamento de Tarefas*
