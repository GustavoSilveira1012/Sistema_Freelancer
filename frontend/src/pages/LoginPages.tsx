import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const {data} = await api.post('/auth/login', {email, password});
            login(data.token, data.user);
            navigate('/dashboard');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                        💰
                    </div>
                    <h1 className="text-3xl font-bold">FreelaFlow</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-2">E-mail</label>
                        <input type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Senha</label>
                        <input type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 py-4 rounded-xl font-semibold fle items-center justify-center gap-2">
                        <LogIn size={20} />
                        Entrar
                    </button>
                </form>
                <p className="text-center mt-6 text-zinc-400">
                    Não tem conta? <Link to="/register" className="text-emerald-400 hover:underline">Cadastre-se</Link>
                </p>
            </div>
        </div>
    );
}