import {useState, useMemo} from 'react';

export const useSearch = <T extends {name?: string; title?: string; tite?: string}>(items: T[]) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = useMemo(() => {
        if (!searchTerm) return items;
        const term = searchTerm.toLowerCase();
        return items.filter(item => (item.name?.toLowerCase().includes(term) ||
        item.title?.toLowerCase().includes(term) ||
        item.tite?.toLowerCase().includes(term))
    );
    }, [items, searchTerm]);

    return {searchTerm, setSearchTerm, filtered};
}