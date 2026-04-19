import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Project, Client } from '../types';
import { useSearch } from '../hooks/useSearch';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import jsPDF from 'jspdf';
import { Plus, Filter, Download, Edit, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [filters, setFilters] = useState({ clientId: '', status: '', paid: '' });
    const { searchTerm, setSearchTerm, filtered: searchedProjects } = useSearch(projects);
    const [form, setForm] = useState<{
        name: string;
        description: string;
        clientId: string;
        value: string;
        status: 'ACTIVE' | 'COMPLETED';
        paid: boolean;
    }>({
        name: '',
        description: '',
        clientId: '',
        value: '',
        status: 'ACTIVE',
        paid: false,
    });

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            clientId: '',
            value: '',
            status: 'ACTIVE',
            paid: false,
        });
    };

    const loadData = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.clientId) params.set('clientId', filters.clientId);
        if (filters.status) params.set('status', filters.status);
        if (filters.paid) params.set('paid', filters.paid);

        const query = params.toString();

        try {
            const [projRes, cliRes] = await Promise.all([
                api.get(query ? `/projects?${query}` : '/projects'),
                api.get('/clients')
            ]);
            setProjects(projRes.data);
            setClients(cliRes.data);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {loadData();}, [filters.clientId, filters.status, filters.paid]);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Relatório de Projetos - FreelaFlow', 20, 20);

        let y = 40;
        searchedProjects.forEach((p) => {
            doc.setFontSize(12);
            doc.text(`Projeto: ${p.name}`, 20, y);
            doc.text(`Cliente: ${p.client.name}`, 20, y + 8);
            doc.text(`Valor: R$ ${p.value || 0} | Status: ${p.paid ? 'Pago' : 'Pendente'}`, 20, y + 16);
            y += 30;
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save('relatorio_projetos.pdf');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...form,
            value: form.value ? Number(form.value) : undefined,
        };

        if (editingProject) {
            await api.put(`/projects/${editingProject.id}`, payload);
        } else {
            await api.post('/projects', payload);
        }
        toast.success(editingProject ? 'Projeto atualizado!' : 'Projeto criado!');

        setModalOpen(false);
        setEditingProject(null);
        resetForm();
        loadData();
    };

    const deleteProject = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            await api.delete(`/projects/${id}`);
            loadData();
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-4xl font-bold">Projetos</h1>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={exportPDF}
                        className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-2xl flex items-center gap-2 font-semibold"
                    >
                        <Download size={18} /> Exportar PDF
                    </button>
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            resetForm();
                            setModalOpen(true);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold"
                    >
                        <Plus size={20} /> Novo Projeto
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-zinc-800 rounded-2xl px-5 py-3 w-full md:w-80"
                />
            </div>

            <div className="bg-zinc-900 p-5 rounded-3xl mb-8">
                <div className="flex items-center gap-2 mb-4 text-zinc-300">
                    <Filter size={18} />
                    <span className="font-semibold">Filtros</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.clientId}
                        onChange={e => setFilters({ ...filters, clientId: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-4 py-3"
                    >
                        <option value="">Todos os clientes</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-4 py-3"
                    >
                        <option value="">Todos os status</option>
                        <option value="ACTIVE">Ativo</option>
                        <option value="COMPLETED">Concluído</option>
                    </select>

                    <select
                        value={filters.paid}
                        onChange={e => setFilters({ ...filters, paid: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-4 py-3"
                    >
                        <option value="">Todos</option>
                        <option value="true">Pago</option>
                        <option value="false">Pendente</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchedProjects.map(project => (
                        <div key={project.id} className="bg-zinc-900 p-6 rounded-3xl">
                            <div className="flex justify-between items-start gap-3">
                                <h3 className="font-semibold text-xl">{project.name}</h3>
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={`text-xs px-3 py-1 rounded-full ${project.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-700 text-zinc-200'}`}>
                                        {project.status === 'ACTIVE' ? 'Ativo' : 'Concluído'}
                                    </span>
                                    <span className={`text-xs px-3 py-1 rounded-full ${project.paid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                        {project.paid ? 'Pago' : 'Pendente'}
                                    </span>
                                </div>
                            </div>
                            {project.description && <p className="text-zinc-400 mt-3">{project.description}</p>}
                            <p className="text-zinc-300 mt-3">Cliente: {project.client.name}</p>
                            <p className="text-emerald-400 font-semibold mt-2">R$ {(project.value || 0).toFixed(2)}</p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setEditingProject(project);
                                        setForm({
                                            name: project.name,
                                            description: project.description ?? '',
                                            clientId: project.clientId,
                                            value: project.value ? String(project.value) : '',
                                            status: project.status,
                                            paid: project.paid,
                                        });
                                        setModalOpen(true);
                                    }}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl flex items-center justify-center gap-2"
                                >
                                    <Edit size={18} /> Editar
                                </button>
                                <button
                                    onClick={() => deleteProject(project.id)}
                                    className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-3 rounded-2xl flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} /> Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProject ? 'Editar Projeto' : 'Novo Projeto'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        placeholder="Nome do projeto"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        required
                    />

                    <textarea
                        placeholder="Descrição"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-5 py-4 min-h-28"
                    />

                    <select
                        value={form.clientId}
                        onChange={e => setForm({ ...form, clientId: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        required
                    >
                        <option value="">Selecione o cliente</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Valor (R$)"
                        value={form.value}
                        onChange={e => setForm({ ...form, value: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'COMPLETED' })}
                            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        >
                            <option value="ACTIVE">Ativo</option>
                            <option value="COMPLETED">Concluído</option>
                        </select>

                        <select
                            value={String(form.paid)}
                            onChange={e => setForm({ ...form, paid: e.target.value === 'true' })}
                            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        >
                            <option value="false">Pendente</option>
                            <option value="true">Pago</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-emerald-500 py-4 rounded-2xl font-semibold">
                        {editingProject ? 'Salvar alterações' : 'Criar projeto'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}