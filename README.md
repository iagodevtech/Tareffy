# TaskFlow - Gerenciador de Tarefas (Kanban) com Tempo Real, Notificações e E-mail

Aplicativo web completo com 7 telas, arrastar & soltar (drag & drop), sincronização em tempo real (Pusher ou polling), notificações no navegador e envio automático de e-mails por cron. Preparado para hospedagem na HostGator (PHP + MySQL).

## Funcionalidades
- Autenticação de usuários (registro, login, sessão, logout)
- Quadro Kanban com colunas e tarefas (drag & drop entre colunas)
- Detalhes da tarefa e atribuição de responsável
- Notificações no navegador e centro de notificações
- Sincronização em tempo real via Pusher (fallback para polling)
- Envio automático de e-mails de lembrete (cron)
- Configurações do usuário e equipe (básico)

## Telas (7)
1. Login
2. Registro
3. Quadro (Board Kanban)
4. Detalhe da Tarefa
5. Notificações
6. Configurações
7. Equipe

## Stack
- Frontend: HTML + CSS + JavaScript (SPA com hash routing)
- Backend: PHP 8+, PDO (MySQL)
- Tempo Real: Pusher (opcional). Se não configurado, usa polling automático.
- E-mail: `mail()` do PHP (usar conta de e-mail da HostGator/cPanel)

## Requisitos
- PHP 8+ (HostGator)
- MySQL 5.7+ / MariaDB

## Configuração
1. Copie o repositório para sua conta. No ambiente local:
   - Crie o arquivo `.env.php` na raiz a partir do `.env.sample.php` e ajuste valores.
2. Crie o banco de dados na HostGator (cPanel > MySQL) e conceda acesso ao usuário.
3. Execute a migração localmente (ou em SSH):
   ```bash
   php /workspace/api/migrate.php
   ```
   Em produção (HostGator), via SSH ou crie uma página protegida que acesse o script uma única vez.

## Estrutura de pastas
- `public/` arquivos estáticos (HTML, CSS, JS)
- `api/` endpoints PHP (auth, tasks, notifications, migrate)
- `cron/` jobs para envio de e-mails
- `.env.php` configurações sensíveis (não versionar)

## Variáveis de ambiente (`.env.php`)
Veja `/.env.sample.php`. Campos principais:
- DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_CHARSET
- APP_URL
- PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER (opcional)
- EMAIL_FROM, EMAIL_FROM_NAME

## Deploy na HostGator
- Coloque o conteúdo de `public/` dentro de `public_html/`.
- Coloque as pastas `api/`, `cron/`, `.env.php` fora do `public_html/` quando possível; caso não, proteja por `.htaccess`.
- Ajuste caminhos no `public/index.html` para apontar para `/api/*.php` corretamente.
- Configure o cron no cPanel (Ex.: a cada hora):
  ```
  php /home/SEU_USUARIO/cron/send_reminders.php > /dev/null 2>&1
  ```
- E-mail: crie uma conta no cPanel e permita `mail()` ou configure SMTP (opcional).

## Como rodar localmente (simples)
- Use um servidor PHP embutido para a API:
  ```bash
  php -S 127.0.0.1:9000 -t /workspace
  ```
- Abra `public/index.html` no navegador e edite `API_BASE` em `public/app.js` se necessário.

## Segurança
- Senhas com `password_hash`
- Sessões de usuário em cookies
- CORS controlado por origem em `api/config.php`
- Filtragem de entrada nos endpoints

## Licença
MIT
