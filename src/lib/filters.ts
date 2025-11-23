// src/lib/filters.ts
// Sistema de filtrado avanzado para productos financieros

import { FinancialProduct, ProductCategory } from './financial-products';

export type FilterType =
  // Tarjetas de crédito
  | 'sin-anualidad'
  | 'cashback'
  | 'puntos'
  | 'para-viajar'
  | 'para-estudiantes'
  | 'sin-buro'
  | 'platinum'
  | 'digital'
  // Préstamos personales
  | 'sin-aval'
  | 'aprobacion-rapida'
  | 'tasa-baja'
  | 'sin-buro-prestamos'
  | 'nomina'
  | 'p2p'
  // Inversiones
  | 'bajo-riesgo'
  | 'alto-rendimiento'
  | 'desde-100'
  | 'garantizado'
  | 'cetes'
  // Cuentas bancarias
  | 'sin-comisiones'
  | 'alto-rendimiento-ahorro'
  | 'digital-banco'
  | 'retiros-ilimitados';

export interface FilterDefinition {
  id: FilterType;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  filterFn: (product: FinancialProduct) => boolean;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  editorial: {
    intro: string;
    metodologia: string;
    tips: string[];
  };
}

/**
 * Definiciones de filtros por categoría
 */
export const FILTER_DEFINITIONS: Record<FilterType, FilterDefinition> = {
  // ===== TARJETAS DE CRÉDITO =====
  'sin-anualidad': {
    id: 'sin-anualidad',
    name: 'Sin Anualidad',
    slug: 'sin-anualidad',
    category: 'credit_card',
    description: 'Tarjetas de crédito 100% gratis, sin anualidad de por vida',
    filterFn: (p) => p.meta_data.annuity === 0 || p.badges.includes('Sin Anualidad') || p.description?.toLowerCase().includes('sin anualidad') || p.benefits.some(b => b.toLowerCase().includes('sin anualidad')),
    seoTitle: 'Las 10 Mejores Tarjetas de Crédito Sin Anualidad en México 2025',
    seoDescription: 'Compara las mejores tarjetas de crédito sin anualidad de por vida. Nu, Stori, Hey Banco y más. 100% gratis sin costos ocultos.',
    h1: 'Las Mejores Tarjetas de Crédito Sin Anualidad',
    editorial: {
      intro: 'Las tarjetas sin anualidad son la mejor opción si buscas evitar costos fijos. Estas tarjetas no cobran cuota anual, lo que te permite ahorrar entre $500 y $3,000 MXN al año dependiendo del tipo de tarjeta.',
      metodologia: 'Evaluamos cada tarjeta considerando: (1) Anualidad $0 garantizada, (2) Costos adicionales ocultos, (3) Beneficios incluidos, (4) Requisitos de ingreso mínimo.',
      tips: [
        'Verifica que sea "sin anualidad de por vida", no solo el primer año',
        'Confirma que no haya cargos por inactividad',
        'Compara los beneficios incluidos sin costo',
      ],
    },
  },

  'cashback': {
    id: 'cashback',
    name: 'Con Cashback',
    slug: 'cashback',
    category: 'credit_card',
    description: 'Tarjetas que te devuelven dinero en cada compra',
    filterFn: (p) => (p.meta_data.cashback_rate && p.meta_data.cashback_rate > 0) || p.benefits.some(b => b.toLowerCase().includes('cashback')) || p.description?.toLowerCase().includes('cashback'),
    seoTitle: 'Las Mejores Tarjetas con Cashback en México 2025',
    seoDescription: 'Gana dinero en cada compra con estas tarjetas de crédito. Cashback de hasta 5% en categorías seleccionadas. Comparativa completa.',
    h1: 'Las Mejores Tarjetas de Crédito con Cashback',
    editorial: {
      intro: 'El cashback es dinero real que recibes de vuelta por tus compras. Las mejores tarjetas ofrecen entre 1% y 5% de cashback según la categoría.',
      metodologia: 'Seleccionamos tarjetas con: (1) Cashback > 1% en compras generales, (2) Categorías con bonificaciones, (3) Sin límite de acumulación, (4) Fácil canje del cashback.',
      tips: [
        'Busca tarjetas con cashback en tus categorías de gasto frecuente',
        'Verifica si el cashback tiene fecha de expiración',
        'Compara el cashback real vs. el CAT de la tarjeta',
      ],
    },
  },

  'puntos': {
    id: 'puntos',
    name: 'Con Puntos',
    slug: 'puntos',
    category: 'credit_card',
    description: 'Acumula puntos y canjéalos por productos o viajes',
    filterFn: (p) => !!p.meta_data.points_program || p.benefits.some(b => b.toLowerCase().includes('puntos')) || (p.description?.toLowerCase().includes('puntos') ?? false),
    seoTitle: 'Las Mejores Tarjetas de Crédito con Puntos en México 2025',
    seoDescription: 'Tarjetas que acumulan puntos en cada compra. Canjéalos por vuelos, productos, experiencias y más.',
    h1: 'Las Mejores Tarjetas de Crédito con Programas de Puntos',
    editorial: {
      intro: 'Los programas de puntos te permiten acumular recompensas por tus compras y canjearlas por vuelos, productos o experiencias. Ideales para maximizar el valor de tus gastos.',
      metodologia: 'Evaluamos: (1) Tasa de acumulación de puntos, (2) Valor real del punto, (3) Facilidad de canje, (4) Alianzas con aerolíneas y comercios.',
      tips: [
        'Calcula el valor real del punto (usualmente 1 punto = $0.10-0.50 MXN)',
        'Verifica la fecha de expiración de puntos',
        'Considera tarjetas con puntos no expirables',
      ],
    },
  },

  'para-viajar': {
    id: 'para-viajar',
    name: 'Para Viajar',
    slug: 'para-viajar',
    category: 'credit_card',
    description: 'Tarjetas con beneficios para viajeros frecuentes',
    filterFn: (p) => p.badges.includes('Viajero') || p.benefits.some(b =>
      b.toLowerCase().includes('millas') ||
      b.toLowerCase().includes('viaje') ||
      b.toLowerCase().includes('lounge')
    ) || (p.description?.toLowerCase().includes('viaj') ?? false) || (p.description?.toLowerCase().includes('millas') ?? false),
    seoTitle: 'Las Mejores Tarjetas de Crédito para Viajar en México 2025',
    seoDescription: 'Tarjetas ideales para viajeros: acumula millas, accede a salas VIP, seguros de viaje y más beneficios.',
    h1: 'Las Mejores Tarjetas de Crédito para Viajeros',
    editorial: {
      intro: 'Si viajas frecuentemente, estas tarjetas te ofrecen millas aéreas, acceso a salas VIP, seguros de viaje y protección en compras internacionales.',
      metodologia: 'Priorizamos: (1) Acumulación de millas/puntos, (2) Acceso a salas VIP, (3) Seguros de viaje incluidos, (4) Sin comisión por uso internacional.',
      tips: [
        'Considera el costo de la anualidad vs. beneficios de viaje',
        'Verifica alianzas con aerolíneas que uses frecuentemente',
        'Aprovecha los seguros de viaje incluidos',
      ],
    },
  },

  'para-estudiantes': {
    id: 'para-estudiantes',
    name: 'Para Estudiantes',
    slug: 'para-estudiantes',
    category: 'credit_card',
    description: 'Tarjetas diseñadas para estudiantes sin historial crediticio',
    filterFn: (p) => p.badges.includes('Estudiantes') || p.meta_data.min_income === 0 || p.description?.toLowerCase().includes('estudiante') || p.name.toLowerCase().includes('estudiante') || p.name.toLowerCase().includes('universit'),
    seoTitle: 'Las Mejores Tarjetas de Crédito para Estudiantes en México 2025',
    seoDescription: 'Tarjetas sin historial crediticio requerido, ideales para estudiantes. Sin ingreso mínimo, construye tu historial desde cero.',
    h1: 'Las Mejores Tarjetas de Crédito para Estudiantes',
    editorial: {
      intro: 'Estas tarjetas están diseñadas específicamente para estudiantes que están construyendo su primer historial crediticio. Sin requisitos complicados.',
      metodologia: 'Seleccionamos tarjetas con: (1) Sin historial en Buró requerido, (2) Sin ingreso mínimo o muy bajo, (3) Proceso de solicitud simple, (4) Educación financiera incluida.',
      tips: [
        'Úsala responsablemente para construir buen historial',
        'Paga siempre el total para evitar intereses',
        'Empieza con límites bajos y ve aumentando',
      ],
    },
  },

  'sin-buro': {
    id: 'sin-buro',
    name: 'Sin Buró de Crédito',
    slug: 'sin-buro',
    category: 'credit_card',
    description: 'Tarjetas que no requieren historial en Buró de Crédito',
    filterFn: (p) => p.badges.includes('Sin Buró') || p.meta_data.requires_credit_history === false || (p.description?.toLowerCase().includes('sin buró') ?? false) || (p.description?.toLowerCase().includes('sin historial') ?? false) || p.benefits.some(b => b.toLowerCase().includes('sin buró')),
    seoTitle: 'Las Mejores Tarjetas Sin Buró de Crédito en México 2025',
    seoDescription: 'Obtén tu tarjeta de crédito sin historial crediticio. Perfectas para empezar a construir tu perfil financiero.',
    h1: 'Las Mejores Tarjetas de Crédito Sin Buró',
    editorial: {
      intro: 'Si no tienes historial crediticio o tu score es bajo, estas tarjetas te dan la oportunidad de comenzar. Son perfectas para construir tu perfil desde cero.',
      metodologia: 'Priorizamos: (1) Aprobación sin consulta a Buró, (2) Proceso 100% digital, (3) Sin anualidad preferentemente, (4) Reportan al Buró para construir historial.',
      tips: [
        'Confirma que la tarjeta reporte al Buró para mejorar tu score',
        'Usa máximo 30% de tu línea de crédito',
        'Paga siempre a tiempo para construir buen historial',
      ],
    },
  },

  'platinum': {
    id: 'platinum',
    name: 'Platinum/Premium',
    slug: 'platinum',
    category: 'credit_card',
    description: 'Tarjetas premium con beneficios exclusivos',
    filterFn: (p) => p.badges.includes('Platinum') || p.badges.includes('Premium') || p.meta_data.tier === 'premium' || p.name.toLowerCase().includes('platinum') || p.name.toLowerCase().includes('black') || p.name.toLowerCase().includes('infinite'),
    seoTitle: 'Las Mejores Tarjetas Platinum y Premium en México 2025',
    seoDescription: 'Tarjetas de crédito premium con beneficios exclusivos: concierge, seguros premium, acceso VIP y más.',
    h1: 'Las Mejores Tarjetas de Crédito Platinum y Premium',
    editorial: {
      intro: 'Las tarjetas premium ofrecen beneficios exclusivos como servicio de concierge 24/7, seguros ampliados, accesos VIP y protecciones especiales.',
      metodologia: 'Evaluamos: (1) Beneficios exclusivos incluidos, (2) Relación costo-beneficio, (3) Seguros y protecciones, (4) Servicios de concierge.',
      tips: [
        'Calcula si usarás suficientes beneficios para justificar la anualidad',
        'Aprovecha todos los seguros incluidos',
        'Usa el concierge para reservaciones y eventos',
      ],
    },
  },

  'digital': {
    id: 'digital',
    name: '100% Digital',
    slug: 'digital',
    category: 'credit_card',
    description: 'Tarjetas digitales sin sucursales físicas',
    filterFn: (p) => p.badges.includes('Digital') || p.meta_data.is_digital === true || (p.description?.toLowerCase().includes('digital') ?? false) || (p.description?.toLowerCase().includes('app') ?? false),
    seoTitle: 'Las Mejores Tarjetas de Crédito Digitales en México 2025',
    seoDescription: 'Tarjetas 100% digitales: solicitud en minutos, sin ir a sucursal, gestión desde app. Nu, Stori, Klar y más.',
    h1: 'Las Mejores Tarjetas de Crédito 100% Digitales',
    editorial: {
      intro: 'Las tarjetas digitales te permiten solicitar, activar y gestionar todo desde tu celular. Sin filas, sin papeleos, todo en minutos.',
      metodologia: 'Priorizamos: (1) Proceso 100% digital, (2) App móvil bien calificada, (3) Respuesta de aprobación rápida, (4) Gestión completa desde app.',
      tips: [
        'Descarga la app y revisa calificaciones antes de solicitar',
        'Verifica que ofrezcan soporte por chat en la app',
        'Asegúrate de poder bloquear/desbloquear la tarjeta al instante',
      ],
    },
  },

  // ===== PRÉSTAMOS PERSONALES =====
  'sin-aval': {
    id: 'sin-aval',
    name: 'Sin Aval',
    slug: 'sin-aval',
    category: 'personal_loan',
    description: 'Préstamos sin necesidad de aval o garantía',
    filterFn: (p) => p.meta_data.requires_guarantor === false || p.badges.includes('Sin Aval') || p.description?.toLowerCase().includes('sin aval') || p.benefits.some(b => b.toLowerCase().includes('sin aval')),
    seoTitle: 'Los Mejores Préstamos Sin Aval en México 2025',
    seoDescription: 'Préstamos personales sin aval ni garantía. Aprobación rápida y sin complicaciones. Compara tasas.',
    h1: 'Los Mejores Préstamos Personales Sin Aval',
    editorial: {
      intro: 'Los préstamos sin aval te permiten obtener financiamiento sin necesidad de un tercero que garantice el pago. Ideales si no quieres involucrar a familiares o amigos.',
      metodologia: 'Evaluamos: (1) Sin requerimiento de aval, (2) Tasas de interés competitivas, (3) Montos disponibles, (4) Plazos flexibles.',
      tips: [
        'Compara el CAT total, no solo la tasa mensual',
        'Verifica comisiones por apertura y prepago',
        'Calcula que la mensualidad no supere 30% de tu ingreso',
      ],
    },
  },

  'aprobacion-rapida': {
    id: 'aprobacion-rapida',
    name: 'Aprobación Rápida',
    slug: 'aprobacion-rapida',
    category: 'personal_loan',
    description: 'Préstamos con respuesta en minutos',
    filterFn: (p) => p.badges.includes('Rápido') || p.meta_data.approval_time === 'fast' || (p.description?.toLowerCase().includes('rápido') ?? false) || (p.description?.toLowerCase().includes('minutos') ?? false) || (p.description?.toLowerCase().includes('inmediat') ?? false),
    seoTitle: 'Los Mejores Préstamos con Aprobación Rápida en México 2025',
    seoDescription: 'Préstamos personales con aprobación en minutos. Dinero en tu cuenta el mismo día. 100% en línea.',
    h1: 'Los Mejores Préstamos con Aprobación Rápida',
    editorial: {
      intro: 'Cuando necesitas dinero urgente, estos préstamos te dan respuesta en minutos y el dinero puede llegar a tu cuenta el mismo día.',
      metodologia: 'Priorizamos: (1) Aprobación en menos de 24 horas, (2) Proceso 100% digital, (3) Depósito rápido, (4) Mínimo papeleo.',
      tips: [
        'Lee bien las condiciones antes de aceptar',
        'Verifica que la tasa sea competitiva (velocidad ≠ tasa alta)',
        'Confirma cuándo llega el dinero a tu cuenta',
      ],
    },
  },

  'tasa-baja': {
    id: 'tasa-baja',
    name: 'Tasa Baja',
    slug: 'tasa-baja',
    category: 'personal_loan',
    description: 'Préstamos con las tasas más competitivas del mercado',
    filterFn: (p) => (p.main_rate_numeric !== null && p.main_rate_numeric < 25) || (p.description?.toLowerCase().includes('tasa baja') ?? false) || p.benefits.some(b => b.toLowerCase().includes('tasa baja')),
    seoTitle: 'Los Mejores Préstamos con Tasa Baja en México 2025',
    seoDescription: 'Préstamos personales con las tasas más bajas del mercado. Ahorra miles en intereses. Comparativa actualizada.',
    h1: 'Los Mejores Préstamos Personales con Tasa Baja',
    editorial: {
      intro: 'Una tasa de interés baja puede ahorrarte miles de pesos durante la vida del préstamo. Estas son las opciones más competitivas del mercado.',
      metodologia: 'Seleccionamos préstamos con: (1) Tasa anual < 25%, (2) Transparencia en comisiones, (3) Sin cargos ocultos, (4) Buenas opiniones de usuarios.',
      tips: [
        'Usa un simulador para ver el ahorro real vs. otras tasas',
        'Considera pagar más del mínimo para reducir intereses',
        'Verifica que no haya penalización por pago anticipado',
      ],
    },
  },

  'sin-buro-prestamos': {
    id: 'sin-buro-prestamos',
    name: 'Sin Buró de Crédito',
    slug: 'sin-buro',
    category: 'personal_loan',
    description: 'Préstamos sin consulta a Buró de Crédito',
    filterFn: (p) => p.badges.includes('Sin Buró') || p.meta_data.requires_credit_history === false || (p.description?.toLowerCase().includes('sin buró') ?? false) || (p.description?.toLowerCase().includes('sin historial') ?? false),
    seoTitle: 'Los Mejores Préstamos Sin Buró de Crédito en México 2025',
    seoDescription: 'Obtén tu préstamo sin historial crediticio. Aprobación sin consultar Buró. Montos desde $5,000.',
    h1: 'Los Mejores Préstamos Sin Buró de Crédito',
    editorial: {
      intro: 'Si tu historial crediticio está dañado o no tienes historial, estos préstamos no consultan Buró y evalúan tu capacidad de pago por otros medios.',
      metodologia: 'Evaluamos: (1) Sin consulta a Buró, (2) Tasas razonables (evitamos usura), (3) Montos accesibles, (4) Plazos flexibles.',
      tips: [
        'Ten especial cuidado con tasas muy altas (>60% anual)',
        'Asegúrate de poder pagar la mensualidad cómodamente',
        'Usa el préstamo para reconstruir tu historial',
      ],
    },
  },

  'nomina': {
    id: 'nomina',
    name: 'Préstamos de Nómina',
    slug: 'nomina',
    category: 'personal_loan',
    description: 'Préstamos con descuento automático de nómina',
    filterFn: (p) => p.meta_data.payroll_deduction === true || p.badges.includes('Nómina') || (p.description?.toLowerCase().includes('nómina') ?? false) || p.name.toLowerCase().includes('nómina'),
    seoTitle: 'Los Mejores Préstamos de Nómina en México 2025',
    seoDescription: 'Préstamos con descuento directo de tu nómina. Tasas preferenciales para empleados formales.',
    h1: 'Los Mejores Préstamos de Nómina',
    editorial: {
      intro: 'Los préstamos de nómina ofrecen tasas preferenciales porque el pago se descuenta automáticamente de tu sueldo, reduciendo el riesgo para el prestamista.',
      metodologia: 'Priorizamos: (1) Tasas preferenciales, (2) Montos según tu salario, (3) Sin aval requerido, (4) Proceso simplificado.',
      tips: [
        'Verifica que el descuento no afecte tu liquidez mensual',
        'Pregunta si puedes prepagar sin penalización',
        'Compara con préstamos tradicionales (a veces son similares)',
      ],
    },
  },

  'p2p': {
    id: 'p2p',
    name: 'Préstamos P2P',
    slug: 'p2p',
    category: 'personal_loan',
    description: 'Préstamos entre personas (peer-to-peer)',
    filterFn: (p) => p.meta_data.loan_type === 'p2p' || p.badges.includes('P2P'),
    seoTitle: 'Los Mejores Préstamos P2P en México 2025',
    seoDescription: 'Préstamos peer-to-peer: financiamiento colectivo con tasas competitivas. Yotepresto, Prestadero y más.',
    h1: 'Los Mejores Préstamos P2P (Peer-to-Peer)',
    editorial: {
      intro: 'Las plataformas P2P conectan directamente a inversionistas con solicitantes de crédito, eliminando intermediarios bancarios y ofreciendo tasas más competitivas.',
      metodologia: 'Evaluamos: (1) Reputación de la plataforma, (2) Tasas competitivas, (3) Transparencia en costos, (4) Proceso de aprobación.',
      tips: [
        'Revisa la calificación de riesgo que te asigne la plataforma',
        'Lee experiencias de otros usuarios',
        'Verifica que la plataforma esté regulada por CNBV/CONDUSEF',
      ],
    },
  },

  // ===== INVERSIONES =====
  'bajo-riesgo': {
    id: 'bajo-riesgo',
    name: 'Bajo Riesgo',
    slug: 'bajo-riesgo',
    category: 'investment',
    description: 'Inversiones seguras con capital garantizado',
    filterFn: (p) => p.meta_data.risk_level === 'bajo' || p.badges.includes('Bajo Riesgo') || (p.description?.toLowerCase().includes('seguro') ?? false) || (p.description?.toLowerCase().includes('garantizado') ?? false),
    seoTitle: 'Las Mejores Inversiones de Bajo Riesgo en México 2025',
    seoDescription: 'Inversiones seguras con capital garantizado: CETES, pagarés, fondos conservadores. Ideal para principiantes.',
    h1: 'Las Mejores Inversiones de Bajo Riesgo',
    editorial: {
      intro: 'Las inversiones de bajo riesgo son ideales si priorizas la seguridad de tu capital sobre altos rendimientos. Perfectas para tu fondo de emergencia o metas de corto plazo.',
      metodologia: 'Seleccionamos inversiones con: (1) Capital garantizado o protegido, (2) Liquidez alta, (3) Rendimientos superiores a inflación, (4) Instituciones reguladas.',
      tips: [
        'Diversifica entre varias opciones de bajo riesgo',
        'Considera inversiones con liquidez diaria para emergencias',
        'Compara rendimientos después de comisiones',
      ],
    },
  },

  'alto-rendimiento': {
    id: 'alto-rendimiento',
    name: 'Alto Rendimiento',
    slug: 'alto-rendimiento',
    category: 'investment',
    description: 'Inversiones con los mejores rendimientos',
    filterFn: (p) => (p.main_rate_numeric !== null && p.main_rate_numeric > 10) || (p.description?.toLowerCase().includes('alto rendimiento') ?? false) || p.benefits.some(b => b.toLowerCase().includes('rendimiento')),
    seoTitle: 'Las Mejores Inversiones de Alto Rendimiento en México 2025',
    seoDescription: 'Inversiones con rendimientos superiores al 10% anual. Fondos, SOFIPOs, crowdfunding y más.',
    h1: 'Las Mejores Inversiones de Alto Rendimiento',
    editorial: {
      intro: 'Si buscas maximizar tus ganancias y entiendes que mayor rendimiento implica mayor riesgo, estas inversiones ofrecen los mejores retornos del mercado.',
      metodologia: 'Evaluamos: (1) Rendimiento histórico consistente, (2) Nivel de riesgo transparente, (3) Regulación y respaldo, (4) Opiniones de inversionistas.',
      tips: [
        'Nunca inviertas todo en una sola opción de alto rendimiento',
        'Entiende completamente los riesgos antes de invertir',
        'Invierte solo dinero que puedas permitirte perder',
      ],
    },
  },

  'desde-100': {
    id: 'desde-100',
    name: 'Desde $100 pesos',
    slug: 'desde-100',
    category: 'investment',
    description: 'Inversiones accesibles desde $100 MXN',
    filterFn: (p) => (p.meta_data.min_investment !== undefined && p.meta_data.min_investment <= 100) || (p.description?.toLowerCase().includes('desde $100') ?? false) || (p.description?.toLowerCase().includes('monto mínimo bajo') ?? false),
    seoTitle: 'Las Mejores Inversiones Desde $100 Pesos en México 2025',
    seoDescription: 'Empieza a invertir con solo $100 pesos. Opciones accesibles para cualquier presupuesto. CETES, SOFIPOs y más.',
    h1: 'Las Mejores Inversiones Desde $100 Pesos',
    editorial: {
      intro: 'No necesitas ser rico para invertir. Estas opciones te permiten comenzar con tan solo $100 pesos y aumentar tu inversión gradualmente.',
      metodologia: 'Priorizamos: (1) Monto mínimo ≤ $100, (2) Sin comisiones altas, (3) Facilidad de uso, (4) Educación financiera incluida.',
      tips: [
        'Comienza con lo que puedas y aumenta gradualmente',
        'Automatiza tus inversiones mensuales',
        'Reinvierte los rendimientos para aprovechar interés compuesto',
      ],
    },
  },

  'garantizado': {
    id: 'garantizado',
    name: 'Garantizado',
    slug: 'garantizado',
    category: 'investment',
    description: 'Inversiones con capital garantizado por el gobierno',
    filterFn: (p) => p.meta_data.guaranteed === true || p.badges.includes('Garantizado') || (p.description?.toLowerCase().includes('garantizado') ?? false) || (p.description?.toLowerCase().includes('protegido') ?? false),
    seoTitle: 'Las Mejores Inversiones Garantizadas en México 2025',
    seoDescription: 'Inversiones con capital protegido por el gobierno mexicano: CETES, bonos gubernamentales y más.',
    h1: 'Las Mejores Inversiones con Capital Garantizado',
    editorial: {
      intro: 'Las inversiones garantizadas cuentan con el respaldo del gobierno mexicano, lo que las convierte en las opciones más seguras del mercado.',
      metodologia: 'Seleccionamos inversiones con: (1) Garantía gubernamental, (2) Liquidez adecuada, (3) Rendimientos competitivos, (4) Acceso fácil.',
      tips: [
        'Ideal para tu fondo de emergencia',
        'Los rendimientos son fijos y predecibles',
        'Perfectas para metas de corto y mediano plazo',
      ],
    },
  },

  'cetes': {
    id: 'cetes',
    name: 'CETES',
    slug: 'cetes',
    category: 'investment',
    description: 'Certificados de la Tesorería de la Federación',
    filterFn: (p) => p.name.toLowerCase().includes('cetes') || p.institution.toLowerCase().includes('cetesdirecto'),
    seoTitle: 'Guía Completa de CETES 2025: Cómo Invertir Paso a Paso',
    seoDescription: 'Todo sobre CETES: rendimientos actuales, cómo invertir, plazos disponibles. La inversión más segura de México.',
    h1: 'Guía Completa para Invertir en CETES',
    editorial: {
      intro: 'Los CETES son la inversión más segura de México, respaldados por el gobierno federal. Ideales para principiantes y para tu fondo de emergencia.',
      metodologia: 'Analizamos: (1) Rendimientos actuales por plazo, (2) Proceso de apertura de cuenta, (3) Liquidez, (4) Fiscalidad de rendimientos.',
      tips: [
        'Puedes invertir desde $100 pesos',
        'Los rendimientos se depositan directamente en tu cuenta',
        'Sin comisiones de CetesDirecto',
      ],
    },
  },

  // ===== CUENTAS BANCARIAS =====
  'sin-comisiones': {
    id: 'sin-comisiones',
    name: 'Sin Comisiones',
    slug: 'sin-comisiones',
    category: 'banking',
    description: 'Cuentas bancarias 100% gratis sin comisiones',
    filterFn: (p) => p.meta_data.monthly_fee === 0 || p.badges.includes('Sin Comisiones') || p.description?.toLowerCase().includes('sin comisiones') || p.benefits.some(b => b.toLowerCase().includes('sin comisiones')),
    seoTitle: 'Las Mejores Cuentas Bancarias Sin Comisiones en México 2025',
    seoDescription: 'Cuentas de banco 100% gratis: sin saldo mínimo, sin comisiones por manejo. Nu, Hey Banco, Klar y más.',
    h1: 'Las Mejores Cuentas Bancarias Sin Comisiones',
    editorial: {
      intro: 'Las cuentas sin comisiones te permiten ahorrar cientos de pesos al año eliminando costos por manejo de cuenta, retiros y transferencias.',
      metodologia: 'Evaluamos: (1) Cero comisiones confirmadas, (2) Sin saldo mínimo, (3) Retiros gratis en cajeros, (4) Transferencias SPEI ilimitadas.',
      tips: [
        'Verifica que no haya comisiones ocultas',
        'Confirma la red de cajeros sin costo',
        'Revisa los límites de operación',
      ],
    },
  },

  'alto-rendimiento-ahorro': {
    id: 'alto-rendimiento-ahorro',
    name: 'Alto Rendimiento',
    slug: 'alto-rendimiento',
    category: 'banking',
    description: 'Cuentas de ahorro con los mejores rendimientos',
    filterFn: (p) => (p.main_rate_numeric !== null && p.main_rate_numeric > 5) || (p.description?.toLowerCase().includes('rendimiento') ?? false) || p.benefits.some(b => b.toLowerCase().includes('rendimiento')),
    seoTitle: 'Las Mejores Cuentas de Ahorro con Alto Rendimiento en México 2025',
    seoDescription: 'Cuentas de ahorro con rendimientos superiores al 5% anual. Gana intereses sin riesgo.',
    h1: 'Las Mejores Cuentas de Ahorro con Alto Rendimiento',
    editorial: {
      intro: 'Estas cuentas combinan la seguridad de un banco tradicional con rendimientos superiores, haciendo que tu dinero trabaje para ti sin riesgo.',
      metodologia: 'Priorizamos: (1) GAT superior a 5%, (2) Liquidez inmediata, (3) Protección por IPAB, (4) Sin comisiones que reduzcan rendimiento.',
      tips: [
        'Compara el GAT Real (después de inflación)',
        'Verifica que puedas retirar sin penalización',
        'Usa para tu fondo de emergencia',
      ],
    },
  },

  'digital-banco': {
    id: 'digital-banco',
    name: 'Bancos Digitales',
    slug: 'digital',
    category: 'banking',
    description: 'Bancos 100% digitales sin sucursales',
    filterFn: (p) => p.badges.includes('Digital') || p.meta_data.is_digital === true || (p.description?.toLowerCase().includes('digital') ?? false) || (p.description?.toLowerCase().includes('app') ?? false),
    seoTitle: 'Los Mejores Bancos Digitales en México 2025',
    seoDescription: 'Bancos 100% en línea: abre tu cuenta en minutos, sin ir a sucursal. Nu, Hey Banco, Klar y más.',
    h1: 'Los Mejores Bancos Digitales de México',
    editorial: {
      intro: 'Los bancos digitales eliminan sucursales físicas para ofrecerte mejor servicio, sin comisiones y con tecnología de punta, todo desde tu celular.',
      metodologia: 'Evaluamos: (1) Apertura 100% digital, (2) App bien valorada, (3) Servicio al cliente responsive, (4) Funcionalidades completas.',
      tips: [
        'Descarga la app y revisa las reseñas antes de abrir cuenta',
        'Verifica que tengan soporte por chat 24/7',
        'Confirma la red de cajeros sin comisión',
      ],
    },
  },

  'retiros-ilimitados': {
    id: 'retiros-ilimitados',
    name: 'Retiros Ilimitados',
    slug: 'retiros-ilimitados',
    category: 'banking',
    description: 'Cuentas con retiros gratis ilimitados en cajeros',
    filterFn: (p) => p.meta_data.free_withdrawals === 'unlimited' || p.benefits.some(b => b.toLowerCase().includes('retiros ilimitados')) || (p.description?.toLowerCase().includes('retiros gratis') ?? false),
    seoTitle: 'Las Mejores Cuentas con Retiros Ilimitados en México 2025',
    seoDescription: 'Cuentas bancarias con retiros gratis ilimitados en cualquier cajero. Sin límites, sin comisiones.',
    h1: 'Las Mejores Cuentas con Retiros Ilimitados',
    editorial: {
      intro: 'Si retiras efectivo frecuentemente, estas cuentas te permiten usar cualquier cajero sin límite de retiros mensuales y sin comisiones.',
      metodologia: 'Priorizamos: (1) Retiros ilimitados confirmados, (2) Red amplia de cajeros, (3) Sin saldo mínimo, (4) Sin comisiones adicionales.',
      tips: [
        'Confirma que incluya cajeros de todas las redes',
        'Verifica los montos máximos por retiro',
        'Revisa si hay límites diarios',
      ],
    },
  },
};

/**
 * Obtener filtros por categoría
 */
export function getFiltersByCategory(category: ProductCategory): FilterDefinition[] {
  return Object.values(FILTER_DEFINITIONS).filter(f => f.category === category);
}

/**
 * Obtener definición de filtro por slug y categoría
 */
export function getFilterDefinition(category: ProductCategory, slug: string): FilterDefinition | null {
  const filters = getFiltersByCategory(category);
  return filters.find(f => f.slug === slug) || null;
}

/**
 * Aplicar filtro a productos
 */
export function applyFilter(products: FinancialProduct[], filter: FilterDefinition): FinancialProduct[] {
  return products.filter(filter.filterFn);
}
