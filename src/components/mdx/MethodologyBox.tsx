import { Info } from 'lucide-react';

interface MethodologyBoxProps {
    children: React.ReactNode;
    date?: string;
    source?: string;
}

export function MethodologyBox({ children, date, source }: MethodologyBoxProps) {
    return (
        <div className="my-8 rounded-lg border border-blue-100 bg-blue-50/50 p-6">
            <div className="mb-4 flex items-center gap-2 text-[#1A365D]">
                <Info className="h-5 w-5" />
                <h3 className="text-lg font-semibold m-0">Metodología de Análisis</h3>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700">
                {children}
            </div>
            {(date || source) && (
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-blue-100 pt-3">
                    {date && <span>📅 Datos actualizados al: {date}</span>}
                    {source && <span>🏛️ Fuentes: {source}</span>}
                </div>
            )}
        </div>
    );
}
