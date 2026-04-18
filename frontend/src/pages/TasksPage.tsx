import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Task, Project } from '../types';
import Modal from '../components/Modal';
import { Plus, Filter, Edit, Trash2 } from 'lucide-react';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState({ projectId: '', status: '', priority: '' });
    const [form, setForm] = useState<{
        title: string;
        status: 'TODO' | 'DOING' | 'DONE';
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        projectId: string;
    }>({
        title: '',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: '',
    });

    const resetForm = () => {
        setForm({
            title: '',
            status: 'TODO',
            priority: 'MEDIUM',
            projectId: '',
        });
    };

    const loadData = async () => {
        const [taskRes, projectRes] = await Promise.all([
            api.get('/tasks'),
            api.get('/projects'),
        ]);
        setTasks(taskRes.data);
        setProjects(projectRes.data);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { loadData(); }, []);

    const filteredTasks = tasks.filter(task => {
        if (filters.projectId && task.projectId !== filters.projectId) return false;
        if (filters.status && task.status !== filters.status) return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        return true;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTask) {
            await api.put(`/tasks/${editingTask.id}`, form);
        } else {
            await api.post('/tasks', form);
        }

        setModalOpen(false);
        setEditingTask(null);
        resetForm();
        loadData();
    };

    const deleteTask = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            await api.delete(`/tasks/${id}`);
            loadData();
        }
    };

    const statusLabel = (status: Task['status']) => {
        if (status === 'TODO') return 'A fazer';
        if (status === 'DOING') return 'Em andamento';
        return 'Concluída';
    };

    const priorityLabel = (priority: Task['priority']) => {
        if (priority === 'LOW') return 'Baixa';
        if (priority === 'MEDIUM') return 'Média';
        return 'Alta';
    };

    const priorityClass = (priority: Task['priority']) => {
        if (priority === 'LOW') return 'bg-sky-500/20 text-sky-300';
        if (priority === 'MEDIUM') return 'bg-amber-500/20 text-amber-300';
        return 'bg-red-500/20 text-red-300';
    };

    return (
        <div className="p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-4xl font-bold">Tarefas</h1>
                <button
                    onClick={() => {
                        setEditingTask(null);
                        resetForm();
                        setModalOpen(true);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-2 font-semibold"
                >
                    <Plus size={20} /> Nova Tarefa
                </button>
            </div>

            <div className="bg-zinc-900 p-5 rounded-3xl mb-8">
                <div className="flex items-center gap-2 mb-4 text-zinc-300">
                    <Filter size={18} />
                    <span className="font-semibold">Filtros</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        value={filters.projectId}
                        onChange={e => setFilters({ ...filters, projectId: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-4 py-3"
                    >
                        <option value="">Todos os projetos</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-4 py-3"
                    >
                        <option value="">Todos os status</option>
                        <option value="TODO">A fazer</option>
                        <option value="DOING">Em andamento</option>
                        <option value="DONE">Concluída</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={e => setFilters({ ...filters, priority: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-4 py-3"
                    >
                        <option value="">Todas as prioridades</option>
                        <option value="LOW">Baixa</option>
                        <option value="MEDIUM">Média</option>
                        <option value="HIGH">Alta</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                    <div key={task.id} className="bg-zinc-900 p-6 rounded-3xl">
                        <div className="flex justify-between items-start gap-3">
                            <h3 className="font-semibold text-xl">{task.title}</h3>
                            <span className={`text-xs px-3 py-1 rounded-full ${priorityClass(task.priority)}`}>
                                {priorityLabel(task.priority)}
                            </span>
                        </div>

                        <p className="text-zinc-300 mt-3">Projeto: {task.project.name}</p>
                        <p className="text-zinc-300 mt-1">Status: {statusLabel(task.status)}</p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setEditingTask(task);
                                    setForm({
                                        title: task.title,
                                        status: task.status,
                                        priority: task.priority,
                                        projectId: task.projectId,
                                    });
                                    setModalOpen(true);
                                }}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-2xl flex items-center justify-center gap-2"
                            >
                                <Edit size={18} /> Editar
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-3 rounded-2xl flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} /> Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        placeholder="Título da tarefa"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        required
                    />

                    <select
                        value={form.projectId}
                        onChange={e => setForm({ ...form, projectId: e.target.value })}
                        className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        required
                    >
                        <option value="">Selecione o projeto</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value as 'TODO' | 'DOING' | 'DONE' })}
                            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        >
                            <option value="TODO">A fazer</option>
                            <option value="DOING">Em andamento</option>
                            <option value="DONE">Concluída</option>
                        </select>

                        <select
                            value={form.priority}
                            onChange={e => setForm({ ...form, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                            className="w-full bg-zinc-800 rounded-2xl px-5 py-4"
                        >
                            <option value="LOW">Baixa</option>
                            <option value="MEDIUM">Média</option>
                            <option value="HIGH">Alta</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-emerald-500 py-4 rounded-2xl font-semibold">
                        {editingTask ? 'Salvar alterações' : 'Criar tarefa'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
