import { Search } from "lucide-react";
import { useState } from "react";

interface BuscarPlantaProps {
    onSearch: (query: string) => void;
}

export default function BuscarPlanta({ onSearch }: BuscarPlantaProps) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="flex items-center gap-2 w-full max-w-xs bg-background border rounded-md px-2 py-1 shadow-sm">
            <Search size={20} className="text-muted-foreground" />
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Buscar planta por nombre..."
                className="w-full bg-transparent outline-none border-none text-sm"
            />
        </div>
    );
}