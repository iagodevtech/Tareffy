#!/usr/bin/env python3
"""
Task Evolution Analyzer for Tareffy
This script analyzes task evolution data and generates charts for project insights.
"""

import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime, timedelta
import argparse
import os
from typing import Dict, List, Any
import requests

# Configure matplotlib for better output
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class TaskEvolutionAnalyzer:
    def __init__(self, api_base_url: str = "http://localhost:3001/api", project_id: str = None):
        self.api_base_url = api_base_url
        self.project_id = project_id
        self.data = {}
        
    def fetch_data_from_api(self, access_token: str = None) -> Dict[str, Any]:
        """Fetch data from Tareffy API"""
        headers = {}
        if access_token:
            headers['Authorization'] = f'Bearer {access_token}'
            
        try:
            # Fetch overview data
            overview_response = requests.get(
                f"{self.api_base_url}/dashboard/overview/{self.project_id}",
                headers=headers
            )
            overview_data = overview_response.json()['data']
            
            # Fetch evolution data
            evolution_response = requests.get(
                f"{self.api_base_url}/dashboard/evolution/{self.project_id}",
                headers=headers
            )
            evolution_data = evolution_response.json()['data']
            
            # Fetch productivity data
            productivity_response = requests.get(
                f"{self.api_base_url}/dashboard/productivity/{self.project_id}",
                headers=headers
            )
            productivity_data = productivity_response.json()['data']
            
            return {
                'overview': overview_data,
                'evolution': evolution_data,
                'productivity': productivity_data
            }
        except requests.RequestException as e:
            print(f"Error fetching data from API: {e}")
            return self._generate_sample_data()
    
    def _generate_sample_data(self) -> Dict[str, Any]:
        """Generate sample data for demonstration purposes"""
        print("Generating sample data for demonstration...")
        
        # Generate sample monthly evolution data
        months = []
        current_date = datetime.now()
        for i in range(6):
            date = current_date - timedelta(days=30*i)
            months.append(date.strftime('%Y-%m'))
        
        monthly_evolution = []
        for i, month in enumerate(reversed(months)):
            monthly_evolution.append({
                'month': f"{month}-01",
                'total_tasks': 20 + i * 5,
                'completed_tasks': 15 + i * 3,
                'in_progress_tasks': 3 + i,
                'todo_tasks': 2 + i,
                'review_tasks': 1
            })
        
        # Generate sample daily completion data
        daily_completion = []
        for i in range(30):
            date = current_date - timedelta(days=29-i)
            daily_completion.append({
                'date': date.strftime('%Y-%m-%d'),
                'completed_count': np.random.randint(0, 5)
            })
        
        return {
            'overview': {
                'taskStats': [
                    {'status': 'COMPLETED', 'count': 45},
                    {'status': 'IN_PROGRESS', 'count': 12},
                    {'status': 'TODO', 'count': 8},
                    {'status': 'IN_REVIEW', 'count': 3}
                ],
                'completedThisMonth': 15,
                'hoursStats': {'estimated': 120, 'actual': 95},
                'overdueTasks': 3,
                'dueThisWeek': 7,
                'memberProductivity': [
                    {
                        'user': {'id': '1', 'name': 'João Silva', 'avatar': ''},
                        'tasksCompleted': 8,
                        'hoursWorked': 45
                    },
                    {
                        'user': {'id': '2', 'name': 'Maria Santos', 'avatar': ''},
                        'tasksCompleted': 7,
                        'hoursWorked': 50
                    }
                ]
            },
            'evolution': {
                'monthlyEvolution': monthly_evolution,
                'dailyCompletion': daily_completion,
                'priorityDistribution': [
                    {'priority': 'HIGH', 'count': 15},
                    {'priority': 'MEDIUM', 'count': 25},
                    {'priority': 'LOW', 'count': 10}
                ]
            },
            'productivity': {
                'velocity': [
                    {'date': '2024-02-01', 'tasks_completed': 2},
                    {'date': '2024-02-02', 'tasks_completed': 3},
                    {'date': '2024-02-03', 'tasks_completed': 1},
                    {'date': '2024-02-04', 'tasks_completed': 4},
                    {'date': '2024-02-05', 'tasks_completed': 2}
                ],
                'timeAccuracy': {
                    'averageEstimated': 8.5,
                    'averageActual': 7.2,
                    'accuracyPercentage': 15.3,
                    'isOverestimated': True
                }
            }
        }
    
    def analyze_task_evolution(self, data: Dict[str, Any]) -> None:
        """Analyze task evolution and generate insights"""
        self.data = data
        
        # Create output directory
        os.makedirs('output', exist_ok=True)
        
        # Generate all charts
        self._create_monthly_evolution_chart()
        self._create_daily_completion_chart()
        self._create_priority_distribution_chart()
        self._create_status_distribution_chart()
        self._create_productivity_metrics_chart()
        self._create_team_performance_chart()
        
        # Generate insights report
        self._generate_insights_report()
        
        print("✅ Analysis complete! Check the 'output' directory for charts and reports.")
    
    def _create_monthly_evolution_chart(self) -> None:
        """Create monthly task evolution chart"""
        evolution_data = self.data['evolution']['monthlyEvolution']
        
        df = pd.DataFrame(evolution_data)
        df['month'] = pd.to_datetime(df['month']).dt.strftime('%b %Y')
        
        fig, ax = plt.subplots(figsize=(12, 6))
        
        x = np.arange(len(df))
        width = 0.2
        
        ax.bar(x - width*1.5, df['completed_tasks'], width, label='Concluído', color='#10B981')
        ax.bar(x - width*0.5, df['in_progress_tasks'], width, label='Em Andamento', color='#F59E0B')
        ax.bar(x + width*0.5, df['todo_tasks'], width, label='A Fazer', color='#6B7280')
        ax.bar(x + width*1.5, df['review_tasks'], width, label='Em Revisão', color='#8B5CF6')
        
        ax.set_xlabel('Mês')
        ax.set_ylabel('Número de Tarefas')
        ax.set_title('Evolução de Tarefas por Mês')
        ax.set_xticks(x)
        ax.set_xticklabels(df['month'], rotation=45)
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('output/monthly_evolution.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_daily_completion_chart(self) -> None:
        """Create daily task completion chart"""
        completion_data = self.data['evolution']['dailyCompletion']
        
        df = pd.DataFrame(completion_data)
        df['date'] = pd.to_datetime(df['date'])
        
        fig, ax = plt.subplots(figsize=(12, 6))
        
        ax.plot(df['date'], df['completed_count'], marker='o', linewidth=2, markersize=6, color='#10B981')
        ax.fill_between(df['date'], df['completed_count'], alpha=0.3, color='#10B981')
        
        ax.set_xlabel('Data')
        ax.set_ylabel('Tarefas Concluídas')
        ax.set_title('Tarefas Concluídas por Dia (Mês Atual)')
        ax.grid(True, alpha=0.3)
        
        # Format x-axis dates
        ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter('%d/%m'))
        ax.xaxis.set_major_locator(plt.matplotlib.dates.DayLocator(interval=3))
        
        plt.tight_layout()
        plt.savefig('output/daily_completion.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_priority_distribution_chart(self) -> None:
        """Create priority distribution pie chart"""
        priority_data = self.data['evolution']['priorityDistribution']
        
        df = pd.DataFrame(priority_data)
        priority_labels = {'HIGH': 'Alta', 'MEDIUM': 'Média', 'LOW': 'Baixa'}
        df['priority_label'] = df['priority'].map(priority_labels)
        
        fig, ax = plt.subplots(figsize=(10, 8))
        
        colors = ['#EF4444', '#F59E0B', '#10B981']
        wedges, texts, autotexts = ax.pie(
            df['count'], 
            labels=df['priority_label'],
            autopct='%1.1f%%',
            colors=colors,
            startangle=90
        )
        
        ax.set_title('Distribuição de Tarefas por Prioridade')
        
        # Enhance text appearance
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
        
        plt.tight_layout()
        plt.savefig('output/priority_distribution.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_status_distribution_chart(self) -> None:
        """Create status distribution chart"""
        status_data = self.data['overview']['taskStats']
        
        df = pd.DataFrame(status_data)
        status_labels = {
            'COMPLETED': 'Concluído',
            'IN_PROGRESS': 'Em Andamento',
            'TODO': 'A Fazer',
            'IN_REVIEW': 'Em Revisão'
        }
        df['status_label'] = df['status'].map(status_labels)
        
        fig, ax = plt.subplots(figsize=(10, 6))
        
        colors = ['#10B981', '#F59E0B', '#6B7280', '#8B5CF6']
        bars = ax.bar(df['status_label'], df['count'], color=colors)
        
        ax.set_xlabel('Status')
        ax.set_ylabel('Número de Tarefas')
        ax.set_title('Distribuição de Tarefas por Status')
        ax.grid(True, alpha=0.3)
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                   f'{int(height)}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig('output/status_distribution.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_productivity_metrics_chart(self) -> None:
        """Create productivity metrics chart"""
        productivity_data = self.data['productivity']
        overview_data = self.data['overview']
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
        
        # Velocity chart
        velocity_df = pd.DataFrame(productivity_data['velocity'])
        velocity_df['date'] = pd.to_datetime(velocity_df['date'])
        
        ax1.plot(velocity_df['date'], velocity_df['tasks_completed'], marker='o', color='#3B82F6')
        ax1.set_title('Velocidade (Tarefas Concluídas por Dia)')
        ax1.set_xlabel('Data')
        ax1.set_ylabel('Tarefas Concluídas')
        ax1.grid(True, alpha=0.3)
        
        # Hours comparison
        hours_stats = overview_data['hoursStats']
        categories = ['Estimadas', 'Reais']
        values = [hours_stats['estimated'], hours_stats['actual']]
        colors = ['#F59E0B', '#10B981']
        
        bars = ax2.bar(categories, values, color=colors)
        ax2.set_title('Comparação de Horas Estimadas vs Reais')
        ax2.set_ylabel('Horas')
        ax2.grid(True, alpha=0.3)
        
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                   f'{int(height)}h', ha='center', va='bottom', fontweight='bold')
        
        # Time accuracy
        accuracy = productivity_data['timeAccuracy']
        ax3.pie([accuracy['accuracyPercentage'], 100 - accuracy['accuracyPercentage']], 
               labels=['Diferença', 'Precisão'],
               colors=['#EF4444' if accuracy['isOverestimated'] else '#10B981', '#E5E7EB'],
               autopct='%1.1f%%',
               startangle=90)
        ax3.set_title('Precisão das Estimativas de Tempo')
        
        # Key metrics
        metrics = [
            f"Tarefas Concluídas: {overview_data['completedThisMonth']}",
            f"Tarefas em Atraso: {overview_data['overdueTasks']}",
            f"Vencem esta Semana: {overview_data['dueThisWeek']}",
            f"Taxa de Conclusão: {(overview_data['completedThisMonth'] / max(sum([stat['count'] for stat in overview_data['taskStats']]), 1)) * 100:.1f}%"
        ]
        
        ax4.axis('off')
        y_pos = 0.8
        for metric in metrics:
            ax4.text(0.1, y_pos, metric, fontsize=12, fontweight='bold')
            y_pos -= 0.2
        ax4.set_title('Métricas Principais')
        
        plt.tight_layout()
        plt.savefig('output/productivity_metrics.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _create_team_performance_chart(self) -> None:
        """Create team performance chart"""
        team_data = self.data['overview']['memberProductivity']
        
        if not team_data:
            return
        
        df = pd.DataFrame(team_data)
        df['user_name'] = df['user'].apply(lambda x: x['name'])
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Tasks completed by team member
        bars1 = ax1.bar(df['user_name'], df['tasksCompleted'], color='#3B82F6')
        ax1.set_title('Tarefas Concluídas por Membro da Equipe')
        ax1.set_xlabel('Membro da Equipe')
        ax1.set_ylabel('Tarefas Concluídas')
        ax1.grid(True, alpha=0.3)
        
        for bar in bars1:
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                   f'{int(height)}', ha='center', va='bottom', fontweight='bold')
        
        # Hours worked by team member
        bars2 = ax2.bar(df['user_name'], df['hoursWorked'], color='#10B981')
        ax2.set_title('Horas Trabalhadas por Membro da Equipe')
        ax2.set_xlabel('Membro da Equipe')
        ax2.set_ylabel('Horas Trabalhadas')
        ax2.grid(True, alpha=0.3)
        
        for bar in bars2:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                   f'{int(height)}h', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig('output/team_performance.png', dpi=300, bbox_inches='tight')
        plt.close()
    
    def _generate_insights_report(self) -> None:
        """Generate insights report"""
        overview_data = self.data['overview']
        productivity_data = self.data['productivity']
        
        report = f"""
# Relatório de Análise de Evolução de Tarefas - Tareffy

## Resumo Executivo
Data de Análise: {datetime.now().strftime('%d/%m/%Y %H:%M')}

## Métricas Principais
- **Tarefas Concluídas este Mês**: {overview_data['completedThisMonth']}
- **Tarefas em Atraso**: {overview_data['overdueTasks']}
- **Tarefas que Vencem esta Semana**: {overview_data['dueThisWeek']}
- **Horas Estimadas**: {overview_data['hoursStats']['estimated']}h
- **Horas Reais**: {overview_data['hoursStats']['actual']}h

## Análise de Produtividade
- **Precisão das Estimativas**: {productivity_data['timeAccuracy']['accuracyPercentage']:.1f}%
- **Status das Estimativas**: {'Superestimadas' if productivity_data['timeAccuracy']['isOverestimated'] else 'Subestimadas'}

## Distribuição por Status
"""
        
        for stat in overview_data['taskStats']:
            status_label = {
                'COMPLETED': 'Concluído',
                'IN_PROGRESS': 'Em Andamento',
                'TODO': 'A Fazer',
                'IN_REVIEW': 'Em Revisão'
            }.get(stat['status'], stat['status'])
            report += f"- **{status_label}**: {stat['count']} tarefas\n"
        
        report += f"""
## Performance da Equipe
"""
        
        for member in overview_data['memberProductivity']:
            report += f"- **{member['user']['name']}**: {member['tasksCompleted']} tarefas concluídas, {member['hoursWorked']}h trabalhadas\n"
        
        report += f"""
## Recomendações
1. **Foco em Tarefas em Atraso**: {overview_data['overdueTasks']} tarefas estão em atraso. Priorize estas tarefas.
2. **Melhoria de Estimativas**: A precisão das estimativas é de {productivity_data['timeAccuracy']['accuracyPercentage']:.1f}%. Considere ajustar o processo de estimativa.
3. **Monitoramento Semanal**: {overview_data['dueThisWeek']} tarefas vencem esta semana. Mantenha foco nestas entregas.

## Gráficos Gerados
- monthly_evolution.png: Evolução mensal de tarefas
- daily_completion.png: Conclusão diária de tarefas
- priority_distribution.png: Distribuição por prioridade
- status_distribution.png: Distribuição por status
- productivity_metrics.png: Métricas de produtividade
- team_performance.png: Performance da equipe

---
*Relatório gerado automaticamente pelo Task Evolution Analyzer*
"""
        
        with open('output/insights_report.md', 'w', encoding='utf-8') as f:
            f.write(report)
        
        print("📊 Relatório de insights gerado: output/insights_report.md")

def main():
    parser = argparse.ArgumentParser(description='Task Evolution Analyzer for Tareffy')
    parser.add_argument('--api-url', default='http://localhost:3001/api', help='API base URL')
    parser.add_argument('--project-id', required=True, help='Project ID to analyze')
    parser.add_argument('--token', help='Access token for API authentication')
    parser.add_argument('--sample', action='store_true', help='Use sample data instead of API')
    
    args = parser.parse_args()
    
    analyzer = TaskEvolutionAnalyzer(args.api_url, args.project_id)
    
    if args.sample:
        data = analyzer._generate_sample_data()
    else:
        data = analyzer.fetch_data_from_api(args.token)
    
    analyzer.analyze_task_evolution(data)

if __name__ == "__main__":
    main()
