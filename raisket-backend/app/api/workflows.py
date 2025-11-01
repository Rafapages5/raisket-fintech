"""
Endpoints de API para workflows financieros de Raisket.
Incluye análisis de presupuesto, evaluación de deudas y recomendaciones de inversión.
"""
import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, validator
from datetime import datetime
from app.services.llm_service import llm_service

# Configurar logging
logger = logging.getLogger(__name__)

# Crear router
router = APIRouter(prefix="/workflows", tags=["Workflows Financieros"])


# ============================================================================
# MODELOS DE PRESUPUESTO
# ============================================================================

class BudgetRequest(BaseModel):
    """Request para análisis de presupuesto."""
    ingresos_mensuales: float = Field(..., gt=0, description="Ingresos mensuales en MXN")
    gastos_fijos: float = Field(..., ge=0, description="Gastos fijos mensuales (renta, servicios, etc.)")
    gastos_variables: float = Field(..., ge=0, description="Gastos variables mensuales (comida, transporte, etc.)")
    gastos_hormiga: float = Field(default=0, ge=0, description="Gastos hormiga mensuales")
    ahorros_actuales: float = Field(default=0, ge=0, description="Ahorros actuales en MXN")

    @validator("gastos_fijos", "gastos_variables")
    def validate_gastos(cls, v, values):
        """Valida que los gastos no excedan los ingresos."""
        if "ingresos_mensuales" in values:
            total = v + values.get("gastos_fijos", 0) if "gastos_variables" in values else v
            if total > values["ingresos_mensuales"] * 2:
                logger.warning("Gastos muy altos detectados")
        return v


class BudgetCategory(BaseModel):
    """Categoría de presupuesto con análisis."""
    nombre: str
    monto_actual: float
    monto_recomendado: float
    porcentaje_actual: float
    porcentaje_recomendado: float
    diferencia: float
    estado: str  # "bien", "alerta", "excedido"


class BudgetResponse(BaseModel):
    """Response con análisis completo de presupuesto."""
    total_gastos: float
    total_disponible: float
    porcentaje_ahorro_actual: float
    porcentaje_ahorro_recomendado: float
    categorias: List[BudgetCategory]
    recomendaciones: List[str]
    analisis_ia: str
    estado_general: str  # "saludable", "precaucion", "critico"
    proyeccion_ahorro_anual: float


# ============================================================================
# MODELOS DE DEUDAS
# ============================================================================

class Deuda(BaseModel):
    """Modelo de una deuda individual."""
    nombre: str = Field(..., description="Nombre/descripción de la deuda")
    monto_total: float = Field(..., gt=0, description="Monto total de la deuda en MXN")
    tasa_interes_anual: float = Field(..., ge=0, le=200, description="Tasa de interés anual (%)")
    pago_minimo_mensual: float = Field(..., gt=0, description="Pago mínimo mensual en MXN")
    plazo_meses: Optional[int] = Field(None, gt=0, description="Plazo en meses (opcional)")


class DebtRequest(BaseModel):
    """Request para evaluación de deudas."""
    deudas: List[Deuda] = Field(..., min_items=1, description="Lista de deudas")
    ingreso_mensual: float = Field(..., gt=0, description="Ingreso mensual disponible para pagar deudas")
    estrategia_preferida: str = Field(
        default="avalancha",
        description="Estrategia: 'avalancha' (mayor interés primero) o 'bola_nieve' (menor monto primero)"
    )

    @validator("estrategia_preferida")
    def validate_estrategia(cls, v):
        """Valida que la estrategia sea válida."""
        if v.lower() not in ["avalancha", "bola_nieve"]:
            raise ValueError("Estrategia debe ser 'avalancha' o 'bola_nieve'")
        return v.lower()


class DeudaAnalisis(BaseModel):
    """Análisis de una deuda específica."""
    nombre: str
    monto_total: float
    tasa_interes_anual: float
    interes_mensual: float
    pago_recomendado: float
    meses_para_liquidar: int
    total_intereses_a_pagar: float
    prioridad: int


class DebtResponse(BaseModel):
    """Response con estrategia de pago de deudas."""
    total_deudas: float
    total_pagos_minimos: float
    deudas_analizadas: List[DeudaAnalisis]
    estrategia_aplicada: str
    orden_pago_sugerido: List[str]
    proyeccion_meses_total: int
    total_intereses_proyectados: float
    ahorro_vs_minimos: float
    recomendaciones: List[str]
    analisis_ia: str


# ============================================================================
# MODELOS DE INVERSIÓN
# ============================================================================

class InvestmentRequest(BaseModel):
    """Request para recomendación de inversión."""
    monto_a_invertir: float = Field(..., gt=0, description="Monto a invertir en MXN")
    plazo_meses: int = Field(..., gt=0, le=360, description="Plazo de inversión en meses")
    perfil_riesgo: str = Field(..., description="Perfil: 'conservador', 'moderado' o 'agresivo'")
    objetivo: str = Field(default="crecimiento", description="Objetivo: 'crecimiento', 'ahorro' o 'retiro'")
    experiencia_inversion: bool = Field(default=False, description="¿Tiene experiencia invirtiendo?")

    @validator("perfil_riesgo")
    def validate_perfil(cls, v):
        """Valida el perfil de riesgo."""
        if v.lower() not in ["conservador", "moderado", "agresivo"]:
            raise ValueError("Perfil debe ser 'conservador', 'moderado' o 'agresivo'")
        return v.lower()

    @validator("objetivo")
    def validate_objetivo(cls, v):
        """Valida el objetivo de inversión."""
        if v.lower() not in ["crecimiento", "ahorro", "retiro"]:
            raise ValueError("Objetivo debe ser 'crecimiento', 'ahorro' o 'retiro'")
        return v.lower()


class InstrumentoInversion(BaseModel):
    """Instrumento de inversión individual."""
    nombre: str
    tipo: str  # "renta_fija", "renta_variable", "mixto"
    porcentaje_portafolio: float
    monto_asignado: float
    rendimiento_esperado_anual: float
    riesgo: str  # "bajo", "medio", "alto"
    liquidez: str  # "inmediata", "corto_plazo", "largo_plazo"
    descripcion: str


class InvestmentResponse(BaseModel):
    """Response con recomendación de portafolio."""
    monto_total: float
    plazo_meses: int
    perfil_riesgo: str
    portafolio_sugerido: List[InstrumentoInversion]
    rendimiento_esperado_anual: float
    proyeccion_valor_final: float
    ganancia_proyectada: float
    riesgo_global: str
    recomendaciones: List[str]
    analisis_ia: str
    consideraciones_importantes: List[str]


# ============================================================================
# FUNCIONES DE CÁLCULO
# ============================================================================

def calcular_regla_50_30_20(ingresos: float) -> Dict[str, float]:
    """
    Calcula la regla 50/30/20 para presupuesto.

    Args:
        ingresos: Ingresos mensuales

    Returns:
        Diccionario con montos recomendados
    """
    return {
        "necesidades": ingresos * 0.50,  # 50% necesidades
        "deseos": ingresos * 0.30,  # 30% gustos
        "ahorro": ingresos * 0.20,  # 20% ahorro/inversión
    }


def calcular_interes_compuesto(
    principal: float,
    tasa_anual: float,
    tiempo_meses: int,
    aportacion_mensual: float = 0
) -> Dict[str, float]:
    """
    Calcula interés compuesto con aportaciones mensuales.

    Args:
        principal: Monto inicial
        tasa_anual: Tasa de interés anual (%)
        tiempo_meses: Tiempo en meses
        aportacion_mensual: Aportación mensual adicional

    Returns:
        Diccionario con valor final y ganancia
    """
    tasa_mensual = (tasa_anual / 100) / 12
    meses = tiempo_meses

    # Valor futuro del principal
    valor_principal = principal * ((1 + tasa_mensual) ** meses)

    # Valor futuro de las aportaciones mensuales
    if aportacion_mensual > 0:
        valor_aportaciones = aportacion_mensual * (
            ((1 + tasa_mensual) ** meses - 1) / tasa_mensual
        )
    else:
        valor_aportaciones = 0

    valor_final = valor_principal + valor_aportaciones
    ganancia = valor_final - principal - (aportacion_mensual * meses)

    return {
        "valor_final": round(valor_final, 2),
        "ganancia": round(ganancia, 2),
        "total_aportado": principal + (aportacion_mensual * meses)
    }


def calcular_amortizacion_deuda(
    monto: float,
    tasa_anual: float,
    pago_mensual: float
) -> Dict[str, Any]:
    """
    Calcula el plan de amortización de una deuda.

    Args:
        monto: Monto total de la deuda
        tasa_anual: Tasa de interés anual (%)
        pago_mensual: Pago mensual

    Returns:
        Diccionario con análisis de la deuda
    """
    tasa_mensual = (tasa_anual / 100) / 12
    saldo = monto
    mes = 0
    total_intereses = 0

    while saldo > 0 and mes < 600:  # Límite de 50 años
        interes_mes = saldo * tasa_mensual
        capital_mes = pago_mensual - interes_mes

        if capital_mes <= 0:
            # El pago no cubre ni el interés
            return {
                "meses": -1,
                "total_intereses": -1,
                "total_pagado": -1,
                "error": "El pago mensual no cubre el interés generado"
            }

        total_intereses += interes_mes
        saldo -= capital_mes
        mes += 1

        if saldo < 0:
            saldo = 0

    return {
        "meses": mes,
        "total_intereses": round(total_intereses, 2),
        "total_pagado": round(monto + total_intereses, 2),
        "error": None
    }


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/budget", response_model=BudgetResponse, status_code=status.HTTP_200_OK)
async def analyze_budget(request: BudgetRequest) -> BudgetResponse:
    """
    Analiza el presupuesto personal usando la regla 50/30/20 y proporciona recomendaciones.
    """
    try:
        logger.info(f"Análisis de presupuesto: ingresos={request.ingresos_mensuales}")

        # Calcular totales
        total_gastos = request.gastos_fijos + request.gastos_variables + request.gastos_hormiga
        disponible = request.ingresos_mensuales - total_gastos
        porcentaje_ahorro_actual = (disponible / request.ingresos_mensuales * 100) if disponible > 0 else 0

        # Aplicar regla 50/30/20
        regla = calcular_regla_50_30_20(request.ingresos_mensuales)

        # Analizar categorías
        categorias = []

        # Necesidades (gastos fijos)
        pct_fijos_actual = (request.gastos_fijos / request.ingresos_mensuales) * 100
        pct_fijos_recomendado = 50
        diferencia_fijos = request.gastos_fijos - regla["necesidades"]

        categorias.append(BudgetCategory(
            nombre="Necesidades (Gastos Fijos)",
            monto_actual=request.gastos_fijos,
            monto_recomendado=regla["necesidades"],
            porcentaje_actual=round(pct_fijos_actual, 2),
            porcentaje_recomendado=pct_fijos_recomendado,
            diferencia=round(diferencia_fijos, 2),
            estado="bien" if diferencia_fijos <= 0 else "alerta" if diferencia_fijos < regla["necesidades"] * 0.2 else "excedido"
        ))

        # Deseos (gastos variables + hormiga)
        gastos_deseos = request.gastos_variables + request.gastos_hormiga
        pct_deseos_actual = (gastos_deseos / request.ingresos_mensuales) * 100
        pct_deseos_recomendado = 30
        diferencia_deseos = gastos_deseos - regla["deseos"]

        categorias.append(BudgetCategory(
            nombre="Deseos (Gastos Variables)",
            monto_actual=gastos_deseos,
            monto_recomendado=regla["deseos"],
            porcentaje_actual=round(pct_deseos_actual, 2),
            porcentaje_recomendado=pct_deseos_recomendado,
            diferencia=round(diferencia_deseos, 2),
            estado="bien" if diferencia_deseos <= 0 else "alerta" if diferencia_deseos < regla["deseos"] * 0.2 else "excedido"
        ))

        # Ahorro
        pct_ahorro_recomendado = 20
        diferencia_ahorro = disponible - regla["ahorro"]

        categorias.append(BudgetCategory(
            nombre="Ahorro e Inversión",
            monto_actual=max(disponible, 0),
            monto_recomendado=regla["ahorro"],
            porcentaje_actual=round(porcentaje_ahorro_actual, 2),
            porcentaje_recomendado=pct_ahorro_recomendado,
            diferencia=round(diferencia_ahorro, 2),
            estado="bien" if disponible >= regla["ahorro"] else "alerta" if disponible > 0 else "excedido"
        ))

        # Generar recomendaciones
        recomendaciones = []

        if request.gastos_fijos > regla["necesidades"]:
            exceso = request.gastos_fijos - regla["necesidades"]
            recomendaciones.append(
                f"Tus gastos fijos representan {pct_fijos_actual:.1f}% de tus ingresos (recomendado: 50%). "
                f"Intenta reducir ${exceso:,.2f} MXN mensuales. Considera negociar servicios o buscar alternativas más económicas."
            )

        if gastos_deseos > regla["deseos"]:
            exceso = gastos_deseos - regla["deseos"]
            recomendaciones.append(
                f"Tus gastos en deseos superan el 30% recomendado. Reduce ${exceso:,.2f} MXN mensuales "
                f"en gastos no esenciales como entretenimiento, comidas fuera o suscripciones."
            )

        if request.gastos_hormiga > 0:
            ahorro_anual = request.gastos_hormiga * 12
            recomendaciones.append(
                f"Tienes ${request.gastos_hormiga:,.2f} MXN en gastos hormiga mensuales. "
                f"Si los eliminas, podrías ahorrar ${ahorro_anual:,.2f} MXN al año."
            )

        if disponible < regla["ahorro"]:
            if disponible <= 0:
                recomendaciones.append(
                    "⚠️ URGENTE: Tus gastos superan tus ingresos. Necesitas reducir gastos inmediatamente o buscar ingresos adicionales."
                )
            else:
                recomendaciones.append(
                    f"Estás ahorrando solo {porcentaje_ahorro_actual:.1f}% de tus ingresos. "
                    f"Intenta llegar al 20% recomendado (${regla['ahorro']:,.2f} MXN mensuales)."
                )
        else:
            recomendaciones.append(
                f"¡Excelente! Estás ahorrando {porcentaje_ahorro_actual:.1f}% de tus ingresos. "
                f"Continúa con este hábito y considera invertir ese ahorro."
            )

        # Proyección de ahorro anual
        proyeccion_ahorro_anual = max(disponible, 0) * 12

        # Determinar estado general
        if disponible >= regla["ahorro"] and request.gastos_fijos <= regla["necesidades"]:
            estado_general = "saludable"
        elif disponible > 0:
            estado_general = "precaucion"
        else:
            estado_general = "critico"

        # Generar análisis con IA
        prompt = f"""Como asesor financiero de Raisket, analiza este presupuesto:

Ingresos: ${request.ingresos_mensuales:,.2f} MXN
Gastos Fijos: ${request.gastos_fijos:,.2f} MXN ({pct_fijos_actual:.1f}%)
Gastos Variables: ${gastos_deseos:,.2f} MXN ({pct_deseos_actual:.1f}%)
Ahorro Actual: ${disponible:,.2f} MXN ({porcentaje_ahorro_actual:.1f}%)

Estado: {estado_general}

Proporciona un análisis personalizado breve (máximo 3 párrafos) con:
1. Evaluación del estado financiero
2. Áreas de oportunidad específicas
3. Un consejo motivacional para mejorar

Sé empático, claro y directo."""

        try:
            analisis_ia = await llm_service.chat(message=prompt)
        except Exception as e:
            logger.warning(f"No se pudo generar análisis IA: {e}")
            analisis_ia = "Análisis detallado no disponible. Revisa las recomendaciones automáticas arriba."

        return BudgetResponse(
            total_gastos=round(total_gastos, 2),
            total_disponible=round(disponible, 2),
            porcentaje_ahorro_actual=round(porcentaje_ahorro_actual, 2),
            porcentaje_ahorro_recomendado=20.0,
            categorias=categorias,
            recomendaciones=recomendaciones,
            analisis_ia=analisis_ia,
            estado_general=estado_general,
            proyeccion_ahorro_anual=round(proyeccion_ahorro_anual, 2)
        )

    except Exception as e:
        logger.error(f"Error en análisis de presupuesto: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al analizar presupuesto: {str(e)}"
        )


@router.post("/debt", response_model=DebtResponse, status_code=status.HTTP_200_OK)
async def analyze_debt(request: DebtRequest) -> DebtResponse:
    """
    Evalúa deudas y proporciona estrategia de pago optimizada.
    """
    try:
        logger.info(f"Análisis de {len(request.deudas)} deudas")

        deudas_analizadas = []
        total_deudas = 0
        total_pagos_minimos = 0

        # Analizar cada deuda
        for deuda in request.deudas:
            total_deudas += deuda.monto_total
            total_pagos_minimos += deuda.pago_minimo_mensual

            # Calcular interés mensual
            tasa_mensual = (deuda.tasa_interes_anual / 100) / 12
            interes_mensual = deuda.monto_total * tasa_mensual

            # Calcular amortización
            amortizacion = calcular_amortizacion_deuda(
                monto=deuda.monto_total,
                tasa_anual=deuda.tasa_interes_anual,
                pago_mensual=deuda.pago_minimo_mensual
            )

            if amortizacion["error"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Error en deuda '{deuda.nombre}': {amortizacion['error']}"
                )

            deudas_analizadas.append(DeudaAnalisis(
                nombre=deuda.nombre,
                monto_total=deuda.monto_total,
                tasa_interes_anual=deuda.tasa_interes_anual,
                interes_mensual=round(interes_mensual, 2),
                pago_recomendado=deuda.pago_minimo_mensual,
                meses_para_liquidar=amortizacion["meses"],
                total_intereses_a_pagar=amortizacion["total_intereses"],
                prioridad=0  # Se asignará después
            ))

        # Validar capacidad de pago
        if total_pagos_minimos > request.ingreso_mensual:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Los pagos mínimos (${total_pagos_minimos:,.2f}) superan el ingreso disponible (${request.ingreso_mensual:,.2f})"
            )

        # Aplicar estrategia de pago
        if request.estrategia_preferida == "avalancha":
            # Ordenar por tasa de interés (mayor primero)
            deudas_analizadas.sort(key=lambda x: x.tasa_interes_anual, reverse=True)
            estrategia_desc = "Avalancha (pagar primero las deudas con mayor interés)"
        else:
            # Ordenar por monto total (menor primero)
            deudas_analizadas.sort(key=lambda x: x.monto_total)
            estrategia_desc = "Bola de Nieve (pagar primero las deudas más pequeñas)"

        # Asignar prioridades
        for i, deuda in enumerate(deudas_analizadas, 1):
            deuda.prioridad = i

        # Calcular dinero extra para deudas
        dinero_extra = request.ingreso_mensual - total_pagos_minimos

        # Generar orden de pago sugerido
        orden_pago = []
        for deuda in deudas_analizadas:
            orden_pago.append(
                f"{deuda.prioridad}. {deuda.nombre} - ${deuda.monto_total:,.2f} MXN "
                f"({deuda.tasa_interes_anual:.1f}% interés anual)"
            )

        # Proyección con estrategia
        proyeccion_meses = max(d.meses_para_liquidar for d in deudas_analizadas)
        total_intereses = sum(d.total_intereses_a_pagar for d in deudas_analizadas)

        # Calcular ahorro vs pagar solo mínimos (estimado)
        ahorro_vs_minimos = total_intereses * 0.25  # Estimación conservadora

        # Generar recomendaciones
        recomendaciones = []

        recomendaciones.append(
            f"Sigue la estrategia {estrategia_desc} para optimizar el pago de tus deudas."
        )

        if dinero_extra > 0:
            recomendaciones.append(
                f"Tienes ${dinero_extra:,.2f} MXN extra mensuales. Aplícalos a la deuda prioritaria "
                f"({deudas_analizadas[0].nombre}) para reducir intereses."
            )
        else:
            recomendaciones.append(
                "Apenas cubres los pagos mínimos. Busca formas de incrementar ingresos o reducir gastos."
            )

        # Identificar deudas peligrosas
        deudas_alta_tasa = [d for d in deudas_analizadas if d.tasa_interes_anual > 40]
        if deudas_alta_tasa:
            nombres = ", ".join([d.nombre for d in deudas_alta_tasa])
            recomendaciones.append(
                f"⚠️ Atención: {nombres} tiene(n) tasas de interés muy altas (>40%). "
                f"Considera consolidar o refinanciar estas deudas."
            )

        recomendaciones.append(
            f"Si liquidas todas las deudas con pagos mínimos, tardarás ~{proyeccion_meses} meses "
            f"y pagarás ${total_intereses:,.2f} MXN en intereses."
        )

        # Generar análisis con IA
        deudas_texto = "\n".join([
            f"- {d.nombre}: ${d.monto_total:,.2f} MXN al {d.tasa_interes_anual:.1f}% anual "
            f"(Pago mínimo: ${d.pago_recomendado:,.2f} MXN)"
            for d in deudas_analizadas
        ])

        prompt = f"""Como asesor financiero de Raisket, analiza esta situación de deudas:

Deudas:
{deudas_texto}

Total deudas: ${total_deudas:,.2f} MXN
Ingreso disponible: ${request.ingreso_mensual:,.2f} MXN
Estrategia: {estrategia_desc}

Proporciona un análisis breve (máximo 3 párrafos) con:
1. Evaluación de la situación de endeudamiento
2. Consejos específicos para estas deudas
3. Mensaje motivacional para salir de deudas

Sé empático pero realista."""

        try:
            analisis_ia = await llm_service.chat(message=prompt)
        except Exception as e:
            logger.warning(f"No se pudo generar análisis IA: {e}")
            analisis_ia = "Análisis detallado no disponible. Revisa las recomendaciones automáticas arriba."

        return DebtResponse(
            total_deudas=round(total_deudas, 2),
            total_pagos_minimos=round(total_pagos_minimos, 2),
            deudas_analizadas=deudas_analizadas,
            estrategia_aplicada=estrategia_desc,
            orden_pago_sugerido=orden_pago,
            proyeccion_meses_total=proyeccion_meses,
            total_intereses_proyectados=round(total_intereses, 2),
            ahorro_vs_minimos=round(ahorro_vs_minimos, 2),
            recomendaciones=recomendaciones,
            analisis_ia=analisis_ia
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en análisis de deudas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al analizar deudas: {str(e)}"
        )


@router.post("/investment", response_model=InvestmentResponse, status_code=status.HTTP_200_OK)
async def recommend_investment(request: InvestmentRequest) -> InvestmentResponse:
    """
    Genera recomendación de portafolio de inversión basado en perfil de riesgo.
    """
    try:
        logger.info(f"Recomendación de inversión: ${request.monto_a_invertir} MXN, perfil {request.perfil_riesgo}")

        portafolio = []
        rendimiento_esperado = 0

        # Definir portafolios según perfil de riesgo
        if request.perfil_riesgo == "conservador":
            # Portafolio conservador (70% renta fija, 30% líquido)
            instrumentos = [
                {
                    "nombre": "CETES",
                    "tipo": "renta_fija",
                    "porcentaje": 50,
                    "rendimiento": 10.5,
                    "riesgo": "bajo",
                    "liquidez": "corto_plazo",
                    "descripcion": "Certificados de la Tesorería (CETES) a 28-91 días. Inversión gubernamental sin riesgo."
                },
                {
                    "nombre": "Fondos de Deuda",
                    "tipo": "renta_fija",
                    "porcentaje": 30,
                    "rendimiento": 9.0,
                    "riesgo": "bajo",
                    "liquidez": "inmediata",
                    "descripcion": "Fondos de inversión en instrumentos de deuda gubernamental y corporativa."
                },
                {
                    "nombre": "Cuenta de Ahorro de Alto Rendimiento",
                    "tipo": "renta_fija",
                    "porcentaje": 20,
                    "rendimiento": 7.0,
                    "riesgo": "bajo",
                    "liquidez": "inmediata",
                    "descripcion": "Cuenta de ahorro con liquidez inmediata y rendimientos competitivos."
                }
            ]
            rendimiento_esperado = 9.35

        elif request.perfil_riesgo == "moderado":
            # Portafolio moderado (40% renta fija, 40% renta variable, 20% mixto)
            instrumentos = [
                {
                    "nombre": "CETES",
                    "tipo": "renta_fija",
                    "porcentaje": 25,
                    "rendimiento": 10.5,
                    "riesgo": "bajo",
                    "liquidez": "corto_plazo",
                    "descripcion": "Base segura del portafolio con CETES."
                },
                {
                    "nombre": "Fondos Indizados (S&P 500 o IPC)",
                    "tipo": "renta_variable",
                    "porcentaje": 35,
                    "rendimiento": 12.0,
                    "riesgo": "medio",
                    "liquidez": "corto_plazo",
                    "descripcion": "ETFs que replican índices de mercado con diversificación amplia."
                },
                {
                    "nombre": "Fondos de Inversión Balanceados",
                    "tipo": "mixto",
                    "porcentaje": 25,
                    "rendimiento": 10.0,
                    "riesgo": "medio",
                    "liquidez": "corto_plazo",
                    "descripcion": "Mezcla de renta fija y variable para balance de riesgo-rendimiento."
                },
                {
                    "nombre": "Bonos Corporativos",
                    "tipo": "renta_fija",
                    "porcentaje": 15,
                    "rendimiento": 11.0,
                    "riesgo": "bajo",
                    "liquidez": "largo_plazo",
                    "descripcion": "Bonos de empresas sólidas con mejor rendimiento que CETES."
                }
            ]
            rendimiento_esperado = 11.0

        else:  # agresivo
            # Portafolio agresivo (70% renta variable, 30% renta fija)
            instrumentos = [
                {
                    "nombre": "Acciones Individuales (Mercado Mexicano)",
                    "tipo": "renta_variable",
                    "porcentaje": 30,
                    "rendimiento": 15.0,
                    "riesgo": "alto",
                    "liquidez": "inmediata",
                    "descripcion": "Acciones de empresas mexicanas con potencial de crecimiento."
                },
                {
                    "nombre": "Fondos Indizados Internacionales",
                    "tipo": "renta_variable",
                    "porcentaje": 30,
                    "rendimiento": 13.0,
                    "riesgo": "alto",
                    "liquidez": "corto_plazo",
                    "descripcion": "ETFs de mercados internacionales para diversificación global."
                },
                {
                    "nombre": "Fondos de Crecimiento (Growth Funds)",
                    "tipo": "renta_variable",
                    "porcentaje": 20,
                    "rendimiento": 14.0,
                    "riesgo": "alto",
                    "liquidez": "corto_plazo",
                    "descripcion": "Fondos enfocados en empresas de alto crecimiento y tecnología."
                },
                {
                    "nombre": "CETES (Reserva Líquida)",
                    "tipo": "renta_fija",
                    "porcentaje": 20,
                    "rendimiento": 10.5,
                    "riesgo": "bajo",
                    "liquidez": "corto_plazo",
                    "descripcion": "Reserva de seguridad para aprovechar oportunidades."
                }
            ]
            rendimiento_esperado = 13.4

        # Construir portafolio con montos
        for instr in instrumentos:
            monto = request.monto_a_invertir * (instr["porcentaje"] / 100)
            portafolio.append(InstrumentoInversion(
                nombre=instr["nombre"],
                tipo=instr["tipo"],
                porcentaje_portafolio=instr["porcentaje"],
                monto_asignado=round(monto, 2),
                rendimiento_esperado_anual=instr["rendimiento"],
                riesgo=instr["riesgo"],
                liquidez=instr["liquidez"],
                descripcion=instr["descripcion"]
            ))

        # Calcular proyección
        proyeccion = calcular_interes_compuesto(
            principal=request.monto_a_invertir,
            tasa_anual=rendimiento_esperado,
            tiempo_meses=request.plazo_meses
        )

        # Generar recomendaciones
        recomendaciones = []

        if request.plazo_meses < 12:
            recomendaciones.append(
                "Tu plazo es corto (<1 año). Considera instrumentos de alta liquidez como CETES o fondos de deuda."
            )
        elif request.plazo_meses >= 60:
            recomendaciones.append(
                f"Con un plazo de {request.plazo_meses} meses, puedes aprovechar el interés compuesto. "
                "Mantén tu inversión sin retirar para maximizar rendimientos."
            )

        if not request.experiencia_inversion:
            recomendaciones.append(
                "Como principiante, empieza con instrumentos sencillos como CETES o fondos indizados. "
                "Educa tu antes de inversiones complejas."
            )

        recomendaciones.append(
            "Diversifica tu portafolio. No pongas todo tu dinero en un solo instrumento."
        )

        if request.perfil_riesgo == "agresivo":
            recomendaciones.append(
                "⚠️ Perfil agresivo: Mayor rendimiento implica mayor volatilidad. "
                "Solo invierte dinero que no necesites en el corto plazo."
            )

        # Riesgo global
        if request.perfil_riesgo == "conservador":
            riesgo_global = "bajo"
        elif request.perfil_riesgo == "moderado":
            riesgo_global = "medio"
        else:
            riesgo_global = "alto"

        # Consideraciones importantes
        consideraciones = [
            "Los rendimientos mostrados son proyecciones y no garantías.",
            "Las inversiones en renta variable pueden tener pérdidas en el corto plazo.",
            "Mantén un fondo de emergencia antes de invertir (3-6 meses de gastos).",
            "Revisa tu portafolio periódicamente y rebalancea si es necesario.",
            f"Considera implicaciones fiscales. Las ganancias pueden estar sujetas a ISR."
        ]

        # Generar análisis con IA
        portafolio_texto = "\n".join([
            f"- {p.nombre}: {p.porcentaje_portafolio}% (${p.monto_asignado:,.2f} MXN) - "
            f"Rendimiento esperado: {p.rendimiento_esperado_anual}%"
            for p in portafolio
        ])

        prompt = f"""Como asesor financiero de Raisket, analiza esta propuesta de inversión:

Monto: ${request.monto_a_invertir:,.2f} MXN
Plazo: {request.plazo_meses} meses
Perfil: {request.perfil_riesgo}
Objetivo: {request.objetivo}
Experiencia: {"Sí" if request.experiencia_inversion else "No"}

Portafolio Sugerido:
{portafolio_texto}

Rendimiento esperado: {rendimiento_esperado}% anual
Valor proyectado: ${proyeccion['valor_final']:,.2f} MXN
Ganancia: ${proyeccion['ganancia']:,.2f} MXN

Proporciona un análisis personalizado (máximo 3 párrafos) con:
1. Evaluación del portafolio para este perfil
2. Consejos específicos para maximizar rendimientos
3. Mensaje motivacional sobre inversión

Sé claro y educativo."""

        try:
            analisis_ia = await llm_service.chat(message=prompt)
        except Exception as e:
            logger.warning(f"No se pudo generar análisis IA: {e}")
            analisis_ia = "Análisis detallado no disponible. Revisa las recomendaciones automáticas arriba."

        return InvestmentResponse(
            monto_total=request.monto_a_invertir,
            plazo_meses=request.plazo_meses,
            perfil_riesgo=request.perfil_riesgo,
            portafolio_sugerido=portafolio,
            rendimiento_esperado_anual=round(rendimiento_esperado, 2),
            proyeccion_valor_final=proyeccion["valor_final"],
            ganancia_proyectada=proyeccion["ganancia"],
            riesgo_global=riesgo_global,
            recomendaciones=recomendaciones,
            analisis_ia=analisis_ia,
            consideraciones_importantes=consideraciones
        )

    except Exception as e:
        logger.error(f"Error en recomendación de inversión: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al generar recomendación: {str(e)}"
        )


@router.get("/health", status_code=status.HTTP_200_OK)
async def workflows_health_check():
    """Health check específico para el módulo de workflows."""
    return {
        "status": "healthy",
        "module": "workflows",
        "endpoints": [
            "/workflows/budget",
            "/workflows/debt",
            "/workflows/investment"
        ]
    }
