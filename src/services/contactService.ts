export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export type ContactStatus = 
  | 'novo'
  | 'atendimento_iniciado'
  | 'cliente_potencial'
  | 'realizando_orcamento'
  | 'cliente_aprovou'
  | 'aguardando_pagamento'
  | 'pagamento_concluido'
  | 'iniciar_projeto'
  | 'inicio_projeto'
  | 'em_desenvolvimento'
  | 'testes'
  | 'entrega_projeto'
  | 'documentacao_projeto'
  | 'finalizacao_projeto'
  | 'projeto_concluido'
  | 'cancelado';

export const statusLabels: Record<ContactStatus, string> = {
  novo: 'Novo Contato',
  atendimento_iniciado: 'Atendimento Iniciado',
  cliente_potencial: 'Cliente em Potencial',
  realizando_orcamento: 'Realizando Orçamento',
  cliente_aprovou: 'Cliente Aprovou',
  aguardando_pagamento: 'Aguardando Pagamento',
  pagamento_concluido: 'Pagamento Concluído',
  iniciar_projeto: 'Iniciar Projeto',
  inicio_projeto: 'Início de Projeto',
  em_desenvolvimento: 'Em Desenvolvimento',
  testes: 'Testes',
  entrega_projeto: 'Entrega do Projeto',
  documentacao_projeto: 'Documentação do Projeto',
  finalizacao_projeto: 'Finalização do Projeto',
  projeto_concluido: 'Projeto Concluído',
  cancelado: 'Cancelado'
};

export const statusColors: Record<ContactStatus, string> = {
  novo: '#3B82F6',
  atendimento_iniciado: '#10B981',
  cliente_potencial: '#F59E0B',
  realizando_orcamento: '#8B5CF6',
  cliente_aprovou: '#06B6D4',
  aguardando_pagamento: '#F97316',
  pagamento_concluido: '#10B981',
  iniciar_projeto: '#6366F1',
  inicio_projeto: '#8B5CF6',
  em_desenvolvimento: '#3B82F6',
  testes: '#F59E0B',
  entrega_projeto: '#10B981',
  documentacao_projeto: '#06B6D4',
  finalizacao_projeto: '#8B5CF6',
  projeto_concluido: '#059669',
  cancelado: '#EF4444'
};

class ContactService {
  private contacts: Contact[] = [];

  // Simular armazenamento local (em produção seria uma API)
  private getStorageKey() {
    return 'iago_portfolio_contacts';
  }

  private loadContacts(): Contact[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveContacts(contacts: Contact[]) {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(contacts));
    } catch (error) {
      console.error('Erro ao salvar contatos:', error);
    }
  }

  async submitContact(contactData: Omit<Contact, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      status: 'novo',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.contacts = this.loadContacts();
    this.contacts.push(newContact);
    this.saveContacts(this.contacts);

    // Enviar email (simulado)
    await this.sendEmailNotification(newContact);

    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    this.contacts = this.loadContacts();
    return this.contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateContactStatus(id: string, status: ContactStatus, notes?: string): Promise<Contact> {
    this.contacts = this.loadContacts();
    const contactIndex = this.contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      throw new Error('Contato não encontrado');
    }

    this.contacts[contactIndex] = {
      ...this.contacts[contactIndex],
      status,
      notes,
      updatedAt: new Date()
    };

    this.saveContacts(this.contacts);
    return this.contacts[contactIndex];
  }

  async deleteContact(id: string): Promise<void> {
    this.contacts = this.loadContacts();
    this.contacts = this.contacts.filter(c => c.id !== id);
    this.saveContacts(this.contacts);
  }

  private async sendEmailNotification(contact: Contact): Promise<void> {
    // Simular envio de email
    console.log('Email enviado para iagodevtech@gmail.com:', {
      subject: `Novo contato: ${contact.subject}`,
      body: `
        Nome: ${contact.name}
        Email: ${contact.email}
        Assunto: ${contact.subject}
        Mensagem: ${contact.message}
        Data: ${contact.createdAt.toLocaleString()}
      `
    });

    // Em produção, aqui seria uma chamada para uma API de email
    // como SendGrid, Mailgun, ou uma API própria
  }

  getStatusStats(): Record<ContactStatus, number> {
    const stats = {} as Record<ContactStatus, number>;
    Object.keys(statusLabels).forEach(status => {
      stats[status as ContactStatus] = 0;
    });

    this.contacts.forEach(contact => {
      stats[contact.status]++;
    });

    return stats;
  }
}

export const contactService = new ContactService();
