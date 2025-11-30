'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TickerItem } from '@/lib/institutions';

interface InstitutionTickerProps {
    items: TickerItem[];
}

export default function InstitutionTicker({ items }: InstitutionTickerProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (!items || items.length === 0) return null;

    // Duplicate items to create seamless loop
    const tickerItems = [...items, ...items];

    return (
        <div className="w-full bg-[#0F172A] border-b border-[#1E293B] overflow-hidden h-12 flex items-center relative z-20">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0F172A] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0F172A] to-transparent z-10" />

            <div
                className={cn(
                    "flex items-center gap-8 whitespace-nowrap animate-scroll hover:pause-animation pl-4",
                    isHovered && "pause-animation"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    animationDuration: `${items.length * 3}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationName: 'scroll'
                }}
            >
                {tickerItems.map((item, index) => (
                    <div key={`${item.institution}-${index}`} className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-white tracking-tight">
                            {item.institution.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className={cn(
                                "font-mono font-medium",
                                item.avg_rating >= 4.5 ? "text-[#00D9A5]" :
                                    item.avg_rating >= 3.5 ? "text-[#F59E0B]" : "text-[#EF4444]"
                            )}>
                                {Number(item.avg_rating).toFixed(1)}
                            </span>
                            {item.trend_indicator === 'up' && <TrendingUp className="w-3 h-3 text-[#00D9A5]" />}
                            {item.trend_indicator === 'down' && <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
                            {item.trend_indicator === 'stable' && <Minus className="w-3 h-3 text-gray-500" />}
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {item.institution_type}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}
