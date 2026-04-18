import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
            <div className='bg-zinc-900 rounded-3xl w-full max-w-lg mx-4'>
                <div className='flex justify-between items-center border-b border-zinc-700 px-6 py-4'>
                    <h2 className='text-xl font-semibold'>{title}</h2>
                    <button onClick={onClose} className='text-zinc-400 hover:text-zinc-200 transition-colors' aria-label='Fechar modal'>
                        ×
                    </button>
                </div>
                <div className='p-6'>
                    {children}
                </div>
            </div>
        </div>
    )
}