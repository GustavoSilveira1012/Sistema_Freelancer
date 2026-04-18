import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Client } from '../types';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [form, setForm] = useState({name: '', email: '', phone: ''});

    const loadClients = async () => {
        const {data} = await api.get('/clients');
        setClients(data);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {loadClients();}, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient) {
            await api.put(`/clients/${editingClient.id}`, form);
        } else {
            await api.post('/clients', form);
        }
        setModalOpen(false);
        setEditingClient(null);
        setForm({name: '', email: '', phone: ''});
        loadClients();
    };

    const deleteClient = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            await api.delete(`/clients/${id}`);
            loadClients();
        }
    };

    return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Clientes</h1>
        <button
          onClick={() => { setEditingClient(null); setModalOpen(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-zinc-900 p-6 rounded-3xl">
            <h3 className="font-semibold text-xl">{client.name}</h3>
            {client.email && <p className="text-zinc-400 mt-1">{client.email}</p>}
            {client.phone && <p className="text-zinc-400">{client.phone}</p>}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setEditingClient(client);
                  setForm({
                    name: client.name,
                    email: client.email ?? '',
                    phone: client.phone ?? '',
                  });
                  setModalOpen(true);
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                <Edit size={18} /> Editar
              </button>
              <button
                onClick={() => deleteClient(client.id)}
                className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            placeholder="Nome completo"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
          />
          <input
            placeholder="Telefone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
          />
          <button type="submit" className="w-full bg-emerald-500 py-4 rounded-2xl font-semibold">
            {editingClient ? 'Salvar alterações' : 'Criar cliente'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
