import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "./ContactManagement.css";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    "Novo Contato",
    "Atendimento Iniciado",
    "Cliente em Potencial",
    "Realizando Orçamento",
    "Cliente Aprovou",
    "Aguardando Pagamento",
    "Pagamento Concluído",
    "Iniciar Projeto",
    "Em Desenvolvimento",
    "Testes",
    "Entrega do Projeto",
    "Documentação do Projeto",
    "Finalização do Projeto",
    "Projeto Concluído",
    "Cancelado",
  ];

  useEffect(() => {
    const savedContacts = localStorage.getItem("contacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);

  const updateContactStatus = (contactId: string, newStatus: string) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...contact, status: newStatus } : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Novo Contato": "#ff6b6b",
      "Atendimento Iniciado": "#4ecdc4",
      "Cliente em Potencial": "#45b7d1",
      "Realizando Orçamento": "#96ceb4",
      "Cliente Aprovou": "#feca57",
      "Aguardando Pagamento": "#ff9ff3",
      "Pagamento Concluído": "#54a0ff",
      "Iniciar Projeto": "#5f27cd",
      "Em Desenvolvimento": "#00d2d3",
      "Testes": "#ff9f43",
      "Entrega do Projeto": "#10ac84",
      "Documentação do Projeto": "#2e86de",
      "Finalização do Projeto": "#ee5a24",
      "Projeto Concluído": "#26de81",
      "Cancelado": "#fc5c65",
    };
    return colors[status] || "#95a5a6";
  };

  const getStatusCount = (status: string) => {
    return contacts.filter((contact) => contact.status === status).length;
  };

  const totalContacts = contacts.length;
  const newContacts = getStatusCount("Novo Contato");
  const inProgress = contacts.filter(
    (contact) =>
      contact.status === "Atendimento Iniciado" ||
      contact.status === "Cliente em Potencial" ||
      contact.status === "Realizando Orçamento"
  ).length;
  const completed = getStatusCount("Projeto Concluído");

  return (
    <div className="contact-management">
      <div className="container">
        <motion.div
          className="contact-management-header"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Gestão de Contatos</h1>
          <p>Gerencie todos os contatos e acompanhe o progresso dos projetos</p>
        </motion.div>

        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="stat-card">
            <span className="stat-number">{totalContacts}</span>
            <span className="stat-label">Total de Contatos</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{newContacts}</span>
            <span className="stat-label">Novos Contatos</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{inProgress}</span>
            <span className="stat-label">Em Andamento</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completed}</span>
            <span className="stat-label">Projetos Concluídos</span>
          </div>
        </motion.div>

        <motion.div
          className="filters-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="filters-grid">
            <div className="search-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou assunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Filtrar por Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {filteredContacts.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Nenhum contato encontrado</h3>
            <p>
              {contacts.length === 0
                ? "Ainda não há contatos registrados. Os contatos aparecerão aqui quando forem enviados pelo formulário."
                : "Nenhum contato corresponde aos filtros aplicados."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="contacts-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                className="contact-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="contact-header">
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <a href={`mailto:${contact.email}`} className="contact-email">
                      {contact.email}
                    </a>
                    <div className="contact-subject">{contact.subject}</div>
                  </div>
                </div>

                <div className="contact-message">{contact.message}</div>

                <div className="contact-meta">
                  <span className="contact-date">
                    {new Date(contact.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="status-selector">
                    <select
                      value={contact.status}
                      onChange={(e) =>
                        updateContactStatus(contact.id, e.target.value)
                      }
                      style={{
                        backgroundColor: getStatusColor(contact.status),
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="contact-actions">
                  <button className="action-btn view" title="Visualizar">
                    <FaEye />
                  </button>
                  <button className="action-btn edit" title="Editar">
                    <FaEdit />
                  </button>
                  <button className="action-btn delete" title="Excluir">
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;
