/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import type { Project, Task } from '../types';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activities, setActivities] = useState<any[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [tasksDoneToday, setTasksDoneToday] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/tasks')
    ]).then(([projRes, taskRes]) => {
      const allProjects = projRes.data;
      const allTasks = taskRes.data;

      setProjects(allProjects);

      // === GANHOS POR MÊS (reais) ===
      const paidProjects = allProjects.filter((p: Project) => p.paid && p.value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const grouped = paidProjects.reduce((acc: any, project: Project) => {
        const monthKey = format(new Date(project.createdAt), 'yyyy-MM');
        acc[monthKey] = (acc[monthKey] || 0) + (project.value || 0);
        return acc;
      }, {});

      const chartData = Object.keys(grouped)
        .sort()
        .map(month => ({
          month: format(new Date(month + '-01'), 'MMM', { locale: ptBR }),
          gain: grouped[month]
        }));

      setMonthlyData(chartData);
      setTotalEarned(paidProjects.reduce((sum: number, p: Project) => sum + (p.value || 0), 0));

      // === TAREFAS CONCLUÍDAS HOJE ===
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const doneToday = allTasks.filter((t: Task) => 
        t.status === 'DONE' && format(new Date(t.createdAt), 'yyyy-MM-dd') === todayStr
      ).length;
      setTasksDoneToday(doneToday);
    });
  }, []);

  useEffect(() => {
    api.get('/activity').then(res => setActivities(res.data));
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-3xl">
          <p className="text-zinc-400 text-sm">Total ganho este mês</p>
          <p className="text-5xl font-bold text-emerald-400 mt-2">R$ {totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-3xl">
          <p className="text-zinc-400 text-sm">Projetos ativos</p>
          <p className="text-5xl font-bold mt-2">{projects.filter(p => p.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-3xl">
          <p className="text-zinc-400 text-sm">Tarefas concluídas hoje</p>
          <p className="text-5xl font-bold text-blue-400 mt-2">{tasksDoneToday}</p>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="mt-10 bg-zinc-900 p-8 rounded-3xl">
        <h2 className="text-xl font-semibold mb-6">Ganhos por mês</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${Number(value ?? 0)}`, 'Ganho']} />
            <Bar dataKey="gain" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10 bg-zinc-900 p-8 rounded-3xl">
        <h2 className="text-xl font-semibold mb-6">Ultimas acoes</h2>
        <div className="space-y-4 max-h-96 overflow-auto">
          {activities.map(log => (
            <div key={log.id} className="flex gap-4 text-sm">
              <span className="text-zinc-500 w-24">{format(new Date(log.createdAt), 'dd/MM HH:mm')}</span>
              <span className="font-medium">{log.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}