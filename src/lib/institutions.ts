import { createClientSupabase } from '@/lib/supabase';

export interface InstitutionRanking {
  institution: string;
  institution_type: string;
  product_count: number;
  avg_rating: number;
  total_reviews: number;
}

export interface TickerItem {
  institution: string;
  institution_type: string;
  avg_rating: number;
  total_reviews: number;
  trend_indicator: 'up' | 'down' | 'stable';
}

export async function getTopInstitutionsByType(
  type: 'banco' | 'sofipo' | 'sofom' | 'fintech',
  limit = 5
): Promise<InstitutionRanking[]> {
  const supabase = createClientSupabase();
  
  // @ts-ignore - RPC types not generated yet
  const { data, error } = await supabase
    .rpc('get_top_institutions_by_type', { p_type: type, p_limit: limit });
  
  if (error) {
    console.error(`Error fetching top institutions for ${type}:`, error);
    return [];
  }
  
  return (data as any) || [];
}

export async function getTopInstitutionsTicker(limit = 20): Promise<TickerItem[]> {
  const supabase = createClientSupabase();
  
  // @ts-ignore - RPC types not generated yet
  const { data, error } = await supabase
    .rpc('get_top_institutions_ticker', { p_limit: limit });
    
  if (error) {
    console.error('Error fetching ticker data:', error);
    return [];
  }
  
  return (data as any) || [];
}

export async function getAllTopInstitutions() {
  const [bancos, sofipos, sofoms, fintechs, ticker] = await Promise.all([
    getTopInstitutionsByType('banco'),
    getTopInstitutionsByType('sofipo'),
    getTopInstitutionsByType('sofom'),
    getTopInstitutionsByType('fintech'),
    getTopInstitutionsTicker()
  ]);

  return {
    byType: {
      banco: bancos,
      sofipo: sofipos,
      sofom: sofoms,
      fintech: fintechs
    },
    ticker
  };
}
