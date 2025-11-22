// src/lib/review-content.ts
// Sistema de contenido editorial para páginas de review individual

import type { FinancialProduct, ProductCategory } from './financial-products';

export interface ReviewContent {
  // Secciones principales
  overview: {
    title: string;
    content: string;
  };

  prosAndCons: {
    pros: string[];
    cons: string[];
  };

  detailedAnalysis: {
    title: string;
    sections: {
      subtitle: string;
      content: string;
    }[];
  };

  bestFor: {
    title: string;
    profiles: string[];
  };

  notRecommendedFor: {
    title: string;
    profiles: string[];
  };

  howToApply: {
    title: string;
    steps: string[];
    requirements: string[];
  };

  faq: {
    question: string;
    answer: string;
  }[];
}

/**
 * Genera contenido editorial completo para una review de producto
 */
export function generateReviewContent(product: FinancialProduct): ReviewContent {
  const categoryContent = getCategorySpecificContent(product);

  return {
    overview: {
      title: '¿Qué es ' + product.name + '?',
      content: generateOverviewContent(product),
    },

    prosAndCons: {
      pros: generatePros(product),
      cons: generateCons(product),
    },

    detailedAnalysis: {
      title: 'Análisis Detallado de ' + product.name,
      sections: categoryContent.analysisSections,
    },

    bestFor: {
      title: '¿Para quién es ideal ' + product.name + '?',
      profiles: categoryContent.bestForProfiles,
    },

    notRecommendedFor: {
      title: '¿Para quién NO es recomendable?',
      profiles: categoryContent.notRecommendedProfiles,
    },

    howToApply: {
      title: '¿Cómo solicitar ' + product.name + '?',
      steps: categoryContent.applicationSteps,
      requirements: categoryContent.requirements,
    },

    faq: categoryContent.faq,
  };
}

/**
 * Genera contenido de overview basado en el producto
 */
function generateOverviewContent(product: FinancialProduct): string {
  const categoryIntros: Record<ProductCategory, string> = {
    credit_card: `${product.name} es una tarjeta de crédito ofrecida por ${product.institution}. ${product.description || 'Esta tarjeta ofrece beneficios competitivos en el mercado mexicano.'}`,
    personal_loan: `${product.name} es un préstamo personal de ${product.institution}. ${product.description || 'Este producto ofrece financiamiento flexible para tus proyectos.'}`,
    investment: `${product.name} es un producto de inversión de ${product.institution}. ${product.description || 'Una opción para hacer crecer tu patrimonio.'}`,
    banking: `${product.name} es una cuenta bancaria de ${product.institution}. ${product.description || 'Diseñada para el manejo de tus finanzas cotidianas.'}`,
  };

  let content = categoryIntros[product.category];

  // Agregar información de rating si existe
  if (product.rating > 0) {
    content += ` Los usuarios le otorgan una calificación promedio de ${product.rating.toFixed(1)} de 5 estrellas, basado en ${product.review_count} reseñas.`;
  }

  return content;
}

/**
 * Genera lista de ventajas basada en benefits y badges
 */
function generatePros(product: FinancialProduct): string[] {
  const pros: string[] = [];

  // Agregar benefits existentes
  if (product.benefits && product.benefits.length > 0) {
    pros.push(...product.benefits.slice(0, 5));
  }

  // Agregar pros basados en badges
  if (product.badges.includes('Sin Anualidad')) {
    pros.push('Sin costo de anualidad');
  }

  if (product.badges.includes('100% Digital')) {
    pros.push('Proceso 100% digital desde tu celular');
  }

  if (product.badges.includes('Aprobación Rápida')) {
    pros.push('Respuesta en menos de 24 horas');
  }

  // Agregar pro de rating si es alto
  if (product.rating >= 4.5) {
    pros.push(`Excelente calificación de usuarios (${product.rating.toFixed(1)}/5)`);
  }

  return [...new Set(pros)]; // Eliminar duplicados
}

/**
 * Genera lista de desventajas (genéricas por categoría)
 */
function generateCons(product: FinancialProduct): string[] {
  const cons: string[] = [];

  // Cons basados en meta_data
  if (product.category === 'credit_card') {
    if (product.meta_data.min_income && product.meta_data.min_income > 15000) {
      cons.push(`Requiere ingresos mínimos de $${product.meta_data.min_income.toLocaleString()} mensuales`);
    }

    if (product.meta_data.annuity && product.meta_data.annuity > 0) {
      cons.push(`Anualidad de $${product.meta_data.annuity.toLocaleString()}`);
    }

    if (!product.badges.includes('Sin Buró')) {
      cons.push('Requiere historial crediticio positivo');
    }
  }

  if (product.category === 'personal_loan') {
    if (product.main_rate_numeric && product.main_rate_numeric > 30) {
      cons.push('Tasa de interés relativamente alta');
    }

    if (product.meta_data.requires_collateral) {
      cons.push('Puede requerir garantía o aval');
    }
  }

  if (product.category === 'investment') {
    if (product.meta_data.min_investment && product.meta_data.min_investment > 1000) {
      cons.push(`Inversión mínima de $${product.meta_data.min_investment.toLocaleString()}`);
    }

    if (product.meta_data.risk_level === 'alto') {
      cons.push('Nivel de riesgo alto - puede haber pérdidas');
    }
  }

  if (product.category === 'banking') {
    if (product.meta_data.monthly_fee && product.meta_data.monthly_fee > 0) {
      cons.push(`Comisión mensual de $${product.meta_data.monthly_fee.toLocaleString()}`);
    }
  }

  // Si no hay cons específicos, agregar uno genérico
  if (cons.length === 0) {
    cons.push('Disponibilidad sujeta a evaluación crediticia');
  }

  return cons;
}

/**
 * Genera contenido específico por categoría
 */
function getCategorySpecificContent(product: FinancialProduct) {
  switch (product.category) {
    case 'credit_card':
      return getCreditCardContent(product);
    case 'personal_loan':
      return getPersonalLoanContent(product);
    case 'investment':
      return getInvestmentContent(product);
    case 'banking':
      return getBankingContent(product);
    default:
      return getGenericContent(product);
  }
}

// ============ CONTENIDO PARA TARJETAS DE CRÉDITO ============
function getCreditCardContent(product: FinancialProduct) {
  return {
    analysisSections: [
      {
        subtitle: 'Costos y Comisiones',
        content: `${product.name} ${product.meta_data.annuity === 0 ? 'no cobra anualidad' : `tiene una anualidad de $${product.meta_data.annuity?.toLocaleString() || 'consultar'}`}. ${product.meta_data.cat ? `El CAT promedio es de ${product.meta_data.cat}` : 'El CAT dependerá de tu perfil crediticio'}.`,
      },
      {
        subtitle: 'Beneficios y Recompensas',
        content: product.meta_data.cashback_rate
          ? `Ofrece ${product.meta_data.cashback_rate}% de cashback en tus compras, lo que te permite recuperar dinero por cada uso de la tarjeta.`
          : product.meta_data.points_rate
            ? `Acumulas puntos por cada compra que puedes canjear por productos, viajes o descuentos.`
            : 'Consulta los beneficios específicos directamente con la institución.',
      },
      {
        subtitle: 'Límite de Crédito',
        content: product.meta_data.credit_limit
          ? `El límite de crédito inicial puede ser de hasta $${product.meta_data.credit_limit.toLocaleString()}, sujeto a evaluación.`
          : 'El límite de crédito se determina según tu historial y capacidad de pago.',
      },
      {
        subtitle: 'Proceso de Solicitud',
        content: product.badges.includes('100% Digital')
          ? 'El proceso es 100% digital - puedes solicitarla desde tu celular sin necesidad de ir a sucursal.'
          : 'Puedes solicitar esta tarjeta en línea o en sucursal.',
      },
    ],

    bestForProfiles: [
      product.meta_data.annuity === 0 ? 'Personas que buscan una tarjeta sin costos de anualidad' : '',
      product.meta_data.cashback_rate ? 'Usuarios que quieren cashback automático en sus compras' : '',
      product.badges.includes('Para Estudiantes') ? 'Estudiantes que buscan su primera tarjeta' : '',
      product.badges.includes('100% Digital') ? 'Personas que prefieren gestionar todo desde su smartphone' : '',
      product.meta_data.min_income && product.meta_data.min_income <= 10000 ? 'Personas con ingresos desde $' + product.meta_data.min_income.toLocaleString() : '',
    ].filter(Boolean),

    notRecommendedProfiles: [
      product.meta_data.min_income && product.meta_data.min_income > 20000 ? 'Personas con ingresos menores a $' + product.meta_data.min_income.toLocaleString() + ' mensuales' : '',
      !product.badges.includes('Sin Buró') ? 'Personas sin historial crediticio o con buró negativo' : '',
      product.meta_data.annuity && product.meta_data.annuity > 1000 ? 'Quienes buscan evitar cualquier comisión anual' : '',
    ].filter(Boolean),

    applicationSteps: [
      'Ingresa al sitio web oficial de ' + product.institution,
      'Completa el formulario de solicitud con tus datos personales',
      'Sube la documentación requerida (INE, comprobante de ingresos, domicilio)',
      'Espera la evaluación crediticia (usualmente 24-48 horas)',
      'Recibe tu tarjeta en tu domicilio en 5-7 días hábiles',
    ],

    requirements: [
      'Ser mayor de 18 años',
      'Identificación oficial vigente (INE/IFE)',
      'Comprobante de domicilio reciente (no mayor a 3 meses)',
      product.meta_data.min_income ? `Ingresos mínimos de $${product.meta_data.min_income.toLocaleString()} mensuales` : 'Comprobante de ingresos',
      !product.badges.includes('Sin Buró') ? 'Historial crediticio positivo' : '',
    ].filter(Boolean),

    faq: [
      {
        question: `¿${product.name} cobra anualidad?`,
        answer: product.meta_data.annuity === 0
          ? `No, ${product.name} no cobra anualidad. Es gratis de por vida.`
          : `Sí, la anualidad es de $${product.meta_data.annuity?.toLocaleString() || 'consultar con la institución'}.`,
      },
      {
        question: '¿Cuánto tiempo tarda la aprobación?',
        answer: product.badges.includes('Aprobación Rápida')
          ? 'La respuesta puede ser en menos de 24 horas para perfiles precalificados.'
          : 'El proceso de evaluación suele tardar entre 24 y 48 horas hábiles.',
      },
      {
        question: '¿Necesito ir a sucursal?',
        answer: product.badges.includes('100% Digital')
          ? 'No, todo el proceso es 100% digital desde tu celular.'
          : 'Puedes aplicar en línea o acudir a una sucursal si lo prefieres.',
      },
      {
        question: `¿Qué tan buena es ${product.name} según los usuarios?`,
        answer: product.rating > 0
          ? `Los usuarios califican ${product.name} con ${product.rating.toFixed(1)} de 5 estrellas, basado en ${product.review_count} reseñas.`
          : 'Este es un producto relativamente nuevo. Consulta opiniones actualizadas en línea.',
      },
    ],
  };
}

// ============ CONTENIDO PARA PRÉSTAMOS PERSONALES ============
function getPersonalLoanContent(product: FinancialProduct) {
  return {
    analysisSections: [
      {
        subtitle: 'Tasas y Costos',
        content: `${product.name} ofrece ${product.main_rate_label || 'una tasa de interés'} de ${product.main_rate_value || 'consultar'}. ${product.meta_data.cat ? `El CAT promedio es de ${product.meta_data.cat}.` : ''} Es importante comparar el CAT total para evaluar el costo real del préstamo.`,
      },
      {
        subtitle: 'Montos y Plazos',
        content: `Puedes solicitar desde $${product.meta_data.min_amount?.toLocaleString() || '5,000'} hasta $${product.meta_data.max_amount?.toLocaleString() || '200,000'}, con plazos de ${product.meta_data.min_term_months || 6} a ${product.meta_data.max_term_months || 36} meses.`,
      },
      {
        subtitle: 'Requisitos y Aprobación',
        content: product.badges.includes('Sin Aval')
          ? 'No requiere aval ni garantía hipotecaria - solo necesitas comprobar tus ingresos.'
          : 'La aprobación depende de tu historial crediticio y capacidad de pago.',
      },
      {
        subtitle: 'Desembolso',
        content: product.badges.includes('Aprobación Rápida')
          ? 'Una vez aprobado, el dinero se deposita en tu cuenta en 24-48 horas.'
          : 'El desembolso se realiza una vez completada la evaluación, usualmente en 3-5 días hábiles.',
      },
    ],

    bestForProfiles: [
      'Personas que necesitan financiamiento rápido',
      product.badges.includes('Sin Aval') ? 'Quienes no cuentan con aval o garantía' : '',
      product.main_rate_numeric && product.main_rate_numeric < 25 ? 'Buscan las tasas más competitivas del mercado' : '',
      product.badges.includes('100% Digital') ? 'Prefieren gestionar todo en línea' : '',
    ].filter(Boolean),

    notRecommendedProfiles: [
      !product.badges.includes('Sin Buró') ? 'Personas con historial crediticio negativo' : '',
      product.meta_data.min_income && product.meta_data.min_income > 15000 ? 'Ingresos menores a $' + product.meta_data.min_income.toLocaleString() : '',
      'Quienes no tienen capacidad de pago comprobable',
    ].filter(Boolean),

    applicationSteps: [
      'Calcula cuánto necesitas y en qué plazo puedes pagar',
      'Ingresa a la plataforma de ' + product.institution,
      'Completa la solicitud con tus datos personales y laborales',
      'Sube documentación (INE, comprobante de ingresos y domicilio)',
      'Espera la evaluación (24-72 horas)',
      'Recibe el dinero directo en tu cuenta bancaria',
    ],

    requirements: [
      'Ser mayor de 18 años',
      'INE/IFE vigente',
      'Comprobante de ingresos',
      'Comprobante de domicilio',
      'Cuenta bancaria a tu nombre (para desembolso)',
      product.meta_data.min_income ? `Ingresos mínimos de $${product.meta_data.min_income.toLocaleString()}` : '',
    ].filter(Boolean),

    faq: [
      {
        question: `¿Cuál es la tasa de interés de ${product.name}?`,
        answer: `La ${product.main_rate_label || 'tasa'} es de ${product.main_rate_value || 'variable según perfil'}. El CAT puede variar según el monto, plazo y tu historial crediticio.`,
      },
      {
        question: '¿Necesito aval?',
        answer: product.badges.includes('Sin Aval')
          ? 'No, este préstamo no requiere aval ni garantía.'
          : 'Depende del monto solicitado - consulta directamente con la institución.',
      },
      {
        question: '¿En cuánto tiempo recibo el dinero?',
        answer: product.badges.includes('Aprobación Rápida')
          ? 'Una vez aprobado, el dinero llega a tu cuenta en 24-48 horas.'
          : 'El desembolso tarda entre 3 y 5 días hábiles después de la aprobación.',
      },
      {
        question: '¿Puedo pagar antes sin penalización?',
        answer: 'La mayoría de los préstamos permiten pagos anticipados. Confirma esta información directamente con ' + product.institution + '.',
      },
    ],
  };
}

// ============ CONTENIDO PARA INVERSIONES ============
function getInvestmentContent(product: FinancialProduct) {
  return {
    analysisSections: [
      {
        subtitle: 'Rendimiento Esperado',
        content: `${product.name} ofrece ${product.main_rate_label || 'un rendimiento'} de ${product.main_rate_value || 'consultar'}. ${product.meta_data.ipab_protected ? 'Esta inversión está protegida por el IPAB hasta $400,000 UDIs.' : ''}`,
      },
      {
        subtitle: 'Inversión Mínima y Plazo',
        content: `Puedes comenzar a invertir desde $${product.meta_data.min_investment?.toLocaleString() || '100'}. ${product.meta_data.term ? `El plazo de inversión es de ${product.meta_data.term}.` : 'Puedes retirar tu dinero cuando lo necesites.'}`,
      },
      {
        subtitle: 'Nivel de Riesgo',
        content: product.meta_data.risk_level === 'bajo'
          ? 'Esta es una inversión de bajo riesgo, ideal para perfiles conservadores.'
          : product.meta_data.risk_level === 'medio'
            ? 'Inversión de riesgo moderado - combina seguridad con potencial de crecimiento.'
            : 'Inversión de mayor riesgo con potencial de rendimientos más altos.',
      },
      {
        subtitle: 'Proceso de Inversión',
        content: product.badges.includes('100% Digital')
          ? 'Todo el proceso es digital - abre tu cuenta e invierte desde tu celular.'
          : 'Puedes abrir tu cuenta de inversión en línea o en sucursal.',
      },
    ],

    bestForProfiles: [
      product.meta_data.min_investment && product.meta_data.min_investment <= 100 ? 'Personas que quieren empezar a invertir con poco dinero' : '',
      product.meta_data.risk_level === 'bajo' ? 'Inversionistas conservadores que buscan seguridad' : '',
      product.meta_data.ipab_protected ? 'Quienes buscan inversiones protegidas por el IPAB' : '',
      product.badges.includes('100% Digital') ? 'Personas que prefieren gestionar inversiones desde su smartphone' : '',
    ].filter(Boolean),

    notRecommendedProfiles: [
      product.meta_data.min_investment && product.meta_data.min_investment > 10000 ? 'Personas con menos de $' + product.meta_data.min_investment.toLocaleString() + ' para invertir' : '',
      product.meta_data.risk_level === 'alto' ? 'Inversionistas que no toleran volatilidad o posibles pérdidas' : '',
      product.meta_data.term && product.meta_data.term.includes('años') ? 'Quienes necesitan liquidez inmediata' : '',
    ].filter(Boolean),

    applicationSteps: [
      'Ingresa a la plataforma de ' + product.institution,
      'Crea tu cuenta de inversión',
      'Completa tu perfil de inversionista',
      'Realiza tu primera transferencia',
      'Selecciona ' + product.name + ' y confirma tu inversión',
      'Monitorea tu rendimiento desde la app o web',
    ],

    requirements: [
      'Ser mayor de 18 años',
      'INE/IFE vigente',
      'Cuenta bancaria a tu nombre',
      'Comprobante de domicilio',
      product.meta_data.min_investment ? `Capital mínimo de $${product.meta_data.min_investment.toLocaleString()}` : '',
    ].filter(Boolean),

    faq: [
      {
        question: `¿Cuánto rinde ${product.name}?`,
        answer: `El rendimiento es de ${product.main_rate_value || 'variable'}. Ten en cuenta que los rendimientos pueden variar según las condiciones del mercado.`,
      },
      {
        question: '¿Está protegida mi inversión?',
        answer: product.meta_data.ipab_protected
          ? 'Sí, está protegida por el IPAB (Instituto para la Protección al Ahorro Bancario) hasta $400,000 UDIs.'
          : 'Consulta directamente con la institución sobre las protecciones y garantías aplicables.',
      },
      {
        question: '¿Puedo retirar mi dinero cuando quiera?',
        answer: product.meta_data.term
          ? `Esta inversión tiene un plazo de ${product.meta_data.term}. El retiro anticipado puede tener penalizaciones.`
          : 'Generalmente puedes retirar tu dinero cuando lo necesites, pero consulta las condiciones específicas.',
      },
      {
        question: '¿Qué tan seguro es?',
        answer: product.meta_data.risk_level === 'bajo'
          ? 'Es una inversión de bajo riesgo, ideal para preservar tu capital.'
          : 'Como toda inversión, tiene riesgos. Revisa el prospecto completo antes de invertir.',
      },
    ],
  };
}

// ============ CONTENIDO PARA CUENTAS BANCARIAS ============
function getBankingContent(product: FinancialProduct) {
  return {
    analysisSections: [
      {
        subtitle: 'Costos y Comisiones',
        content: product.meta_data.monthly_fee === 0
          ? `${product.name} no cobra comisión mensual, lo que te permite ahorrar dinero en mantenimiento de cuenta.`
          : `La comisión mensual es de $${product.meta_data.monthly_fee?.toLocaleString() || 'consultar'}.`,
      },
      {
        subtitle: 'Rendimiento',
        content: product.meta_data.yield_rate
          ? `Tu dinero genera un rendimiento de ${product.meta_data.yield_rate}% anual, superior a las cuentas tradicionales.`
          : 'Consulta las tasas de rendimiento vigentes directamente con la institución.',
      },
      {
        subtitle: 'Retiros y Transferencias',
        content: product.meta_data.atm_withdrawals === 'ilimitados'
          ? 'Retiros ilimitados en cajeros automáticos sin costo.'
          : product.meta_data.free_withdrawals
            ? `Hasta ${product.meta_data.free_withdrawals} retiros gratis al mes en cajeros.`
            : 'Consulta las políticas de retiros y transferencias.',
      },
      {
        subtitle: 'Beneficios Digitales',
        content: product.badges.includes('100% Digital')
          ? 'Cuenta 100% digital - gestiona todo desde la app sin necesidad de ir a sucursal.'
          : 'Puedes gestionar tu cuenta tanto en línea como en sucursales físicas.',
      },
    ],

    bestForProfiles: [
      product.meta_data.monthly_fee === 0 ? 'Personas que buscan evitar comisiones bancarias' : '',
      product.meta_data.yield_rate ? 'Quienes quieren que su dinero genere rendimientos' : '',
      product.badges.includes('100% Digital') ? 'Usuarios que prefieren banca digital' : '',
      product.meta_data.min_balance === 0 ? 'Personas sin saldo mínimo requerido' : '',
    ].filter(Boolean),

    notRecommendedProfiles: [
      product.meta_data.min_balance && product.meta_data.min_balance > 5000 ? 'Personas que no pueden mantener $' + product.meta_data.min_balance.toLocaleString() + ' de saldo mínimo' : '',
      !product.badges.includes('100% Digital') && product.badges.includes('Solo Digital') ? 'Quienes prefieren atención en sucursal física' : '',
    ].filter(Boolean),

    applicationSteps: [
      'Descarga la app de ' + product.institution + ' o ingresa a su sitio web',
      'Inicia el proceso de apertura de cuenta',
      'Toma fotos de tu INE y una selfie para validación',
      'Completa tus datos personales',
      'Espera la validación (usualmente en minutos)',
      'Recibe tu cuenta activa y comienza a usarla',
    ],

    requirements: [
      'Ser mayor de 18 años',
      'INE/IFE vigente',
      'Número de celular activo',
      'Correo electrónico',
      product.meta_data.min_opening_balance ? `Depósito inicial de $${product.meta_data.min_opening_balance.toLocaleString()}` : '',
    ].filter(Boolean),

    faq: [
      {
        question: `¿${product.name} cobra comisiones?`,
        answer: product.meta_data.monthly_fee === 0
          ? 'No, no hay comisión mensual por mantenimiento de cuenta.'
          : `Sí, la comisión es de $${product.meta_data.monthly_fee?.toLocaleString() || 'consultar'} mensuales.`,
      },
      {
        question: '¿Mi dinero genera intereses?',
        answer: product.meta_data.yield_rate
          ? `Sí, genera ${product.meta_data.yield_rate}% anual sobre tu saldo.`
          : 'Consulta las tasas de rendimiento vigentes con la institución.',
      },
      {
        question: '¿Puedo retirar en cualquier cajero?',
        answer: product.meta_data.atm_withdrawals === 'ilimitados'
          ? 'Sí, retiros ilimitados sin costo en la red de cajeros.'
          : 'Consulta la red de cajeros sin comisión y las políticas de retiros.',
      },
      {
        question: '¿Qué tan seguro es?',
        answer: 'Todas las cuentas bancarias en México están protegidas por el IPAB hasta $400,000 UDIs en caso de quiebra del banco.',
      },
    ],
  };
}

// ============ CONTENIDO GENÉRICO (FALLBACK) ============
function getGenericContent(product: FinancialProduct) {
  return {
    analysisSections: [
      {
        subtitle: 'Características Principales',
        content: product.description || `${product.name} es un producto financiero ofrecido por ${product.institution}.`,
      },
      {
        subtitle: 'Beneficios',
        content: product.benefits.length > 0
          ? product.benefits.join(', ') + '.'
          : 'Consulta los beneficios específicos directamente con la institución.',
      },
    ],

    bestForProfiles: [
      'Personas que buscan productos financieros confiables',
      product.rating >= 4.5 ? 'Usuarios que valoran productos bien calificados' : '',
    ].filter(Boolean),

    notRecommendedProfiles: [
      'Personas que no cumplen con los requisitos de la institución',
    ],

    applicationSteps: [
      'Visita el sitio web de ' + product.institution,
      'Completa la solicitud en línea',
      'Proporciona la documentación requerida',
      'Espera la evaluación',
      'Recibe confirmación y comienza a usar el producto',
    ],

    requirements: [
      'Ser mayor de 18 años',
      'Identificación oficial vigente',
      'Comprobante de domicilio',
    ],

    faq: [
      {
        question: `¿Cómo solicito ${product.name}?`,
        answer: `Puedes solicitar ${product.name} directamente en el sitio web de ${product.institution}.`,
      },
      {
        question: '¿Qué documentos necesito?',
        answer: 'Generalmente necesitas INE, comprobante de domicilio y comprobante de ingresos.',
      },
    ],
  };
}
