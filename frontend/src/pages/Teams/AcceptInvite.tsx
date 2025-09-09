import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { teamService, TeamInvite } from '../../services/teamService';

const AcceptInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<TeamInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvite();
  }, []);

  const loadInvite = async () => {
    try {
      setLoading(true);
      const inviteId = searchParams.get('invite');
      
      if (!inviteId) {
        setError('ID do convite não fornecido');
        return;
      }

      // Buscar convites pendentes do usuário
      const invites = await teamService.getPendingInvites();
      const foundInvite = invites.find(inv => inv.id === inviteId);
      
      if (!foundInvite) {
        setError('Convite não encontrado ou já foi processado');
        return;
      }

      setInvite(foundInvite);
    } catch (error: any) {
      console.error('Erro ao carregar convite:', error);
      setError(error.message || 'Erro ao carregar convite');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!invite) return;

    try {
      setAccepting(true);
      await teamService.acceptInvite(invite.id);
      alert('Convite aceito com sucesso! Você agora é membro da equipe.');
      navigate('/teams');
    } catch (error: any) {
      console.error('Erro ao aceitar convite:', error);
      alert(error.message || 'Erro ao aceitar convite');
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (!invite) return;

    try {
      setAccepting(true);
      await teamService.rejectInvite(invite.id);
      alert('Convite rejeitado.');
      navigate('/teams');
    } catch (error: any) {
      console.error('Erro ao rejeitar convite:', error);
      alert(error.message || 'Erro ao rejeitar convite');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-4">
            <XMarkIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/teams')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar para Equipes
          </button>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Convite não encontrado</h2>
          <p className="text-gray-600 mb-4">Este convite não existe ou já foi processado.</p>
          <button
            onClick={() => navigate('/teams')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar para Equipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Convite para Equipe</h2>
          <p className="text-gray-600">Você foi convidado para participar de uma equipe</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Detalhes do Convite</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Equipe:</span>
              <span className="ml-2 text-gray-900">{invite.teams?.name || 'Nome não disponível'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Descrição:</span>
              <span className="ml-2 text-gray-900">{invite.teams?.description || 'Sem descrição'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cargo:</span>
              <span className="ml-2 text-gray-900">
                {invite.role === 'admin' ? 'Administrador' : 
                 invite.role === 'dev' ? 'Desenvolvedor' : 'Membro'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Expira em:</span>
              <span className="ml-2 text-gray-900">
                {new Date(invite.expires_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleReject}
            disabled={accepting}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <XMarkIcon className="h-4 w-4" />
            Rejeitar
          </button>
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {accepting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processando...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Aceitar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
