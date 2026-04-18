import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import type { Project } from '../types';

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tasks, setTasks] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);

    useEffect(() => {
        api.get('/projects').then(res => {
            setProjects(res.data);
            const paidThisMonth = res.data
                .filter((p: Project) => p.paid)
                .reduce((acc: number, p: Project) => acc + (p.value || 0), 0);
            setTotalEarned(paidThisMonth);
        });
    }, []);

    const mockMonthlyData = [ // substitua por cálculo real depois
    { month: 'Jan', gain: 1200 },
    { month: 'Fev', gain: 2800 },
    { month: 'Mar', gain: 1900 },
  ];

    return (
        <div className='p-8'>
            <h1 className='text-4xl font-bold mb-8'>Dashboard</h1>
            <div className='grid grid-cols-3 gap-6'>
                <div className='bg-zinc-900 p-6 rounded-3xl'>
                    <p className='text-zinc-400'>Totaal ganho esse mês</p>
                    <p className='text-5xl font-bold text-emerald-400 mt-2'>R$ {totalEarned.toFixed(2)}</p>
                </div>
                <div className='bg-zinc-900 p-6 rounded-3xl'>
                    <p className='text-zinc-400'>Projetos ativos</p>
                    <p className='text-5xl font-bold text-emerald-400 mt-2'>{projects.filter(p => p.status === 'ACTIVE').length}</p>
                </div>
                <div className='bg-zinc-900 p-6 rounded-3xl'>
                    <p className='text-zinc-400'>Tarefas concluidas</p>
                    <p className='text-5xl font-bold text-emerald-400 mt-2'>{tasks}</p>
                </div>
            </div>

            <div className='mt-10 bg-zinc-900 p-8 rounded-3xl'>
                <h2 className='text-xl mb-6'>Ganhos por mês</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockMonthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="gain" fill="#10b981" radius={8} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        
    )
}