'use client';

import { useState } from 'react';
import { Building2, Wallet, Landmark, Smartphone, ChevronRight, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { InstitutionRanking } from '@/lib/institutions';

interface TopInstitutionsSectionProps {
    institutionsByType: {
        banco: InstitutionRanking[];
        sofipo: InstitutionRanking[];
        sofom: InstitutionRanking[];
        fintech: InstitutionRanking[];
    };
}

const TABS = [
    { id: 'banco', label: 'Bancos', icon: Landmark, color: 'text-blue-400' },
    { id: 'sofipo', label: 'Sofipos', icon: Wallet, color: 'text-purple-400' },
    { id: 'fintech', label: 'Fintechs', icon: Smartphone, color: 'text-[#00D9A5]' },
    { id: 'sofom', label: 'Sofomes', icon: Building2, color: 'text-orange-400' },
] as const;

export default function TopInstitutionsSection({ institutionsByType }: TopInstitutionsSectionProps) {
    const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('banco');

    const activeInstitutions = institutionsByType[activeTab] || [];

    return (
        <section className="py-16 bg-[#0F172A] text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <span className="w-1 h-8 bg-[#00D9A5] rounded-full block"></span>
                            Top Instituciones
                        </h2>
                        <p className="text-gray-400">Ranking en tiempo real basado en calidad y satisfacción</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 bg-[#1E293B]/50 p-1.5 rounded-xl border border-[#334155]">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-[#334155] text-white shadow-lg"
                                        : "text-gray-400 hover:text-white hover:bg-[#334155]/50"
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? tab.color : "text-gray-500")} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {activeInstitutions.length > 0 ? (
                        activeInstitutions.map((inst, index) => (
                            <div
                                key={inst.institution}
                                className="group bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-[#00D9A5] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 bg-[#334155] px-3 py-1 rounded-bl-xl text-xs font-mono text-gray-300">
                                    #{index + 1}
                                </div>

                                <div className="w-12 h-12 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center mb-4 text-xl font-bold text-gray-300 group-hover:text-white group-hover:border-[#00D9A5]/50 transition-colors">
                                    {inst.institution.charAt(0)}
                                </div>

                                <h3 className="font-semibold text-lg mb-1 truncate" title={inst.institution}>
                                    {inst.institution}
                                </h3>
                                <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider">
                                    {inst.institution_type}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 flex items-center gap-1">
                                            <Star className="w-3 h-3" /> Rating
                                        </span>
                                        <span className={cn(
                                            "font-mono font-medium",
                                            inst.avg_rating >= 4.5 ? "text-[#00D9A5]" : "text-[#F59E0B]"
                                        )}>
                                            {Number(inst.avg_rating).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> Reviews
                                        </span>
                                        <span className="font-mono text-white">
                                            {inst.total_reviews.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#334155]">
                                    <Link href={`/institucion/${inst.institution.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-[#00D9A5] hover:text-[#00C294] flex items-center justify-center gap-1 font-medium group-hover:gap-2 transition-all">
                                        Ver Perfil <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-[#1E293B]/30 rounded-xl border border-dashed border-[#334155]">
                            No hay datos disponibles para esta categoría aún.
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center">
                    <Button variant="outline" className="border-[#334155] text-gray-300 hover:bg-[#334155] hover:text-white bg-transparent">
                        Ver Ranking Completo
                    </Button>
                </div>
            </div>
        </section>
    );
}
