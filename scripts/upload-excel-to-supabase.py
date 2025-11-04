"""
Script para subir productos desde Excel a Supabase
Uso: python scripts/upload-excel-to-supabase.py ruta/al/archivo.xlsx
"""

import pandas as pd
import sys
import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('.env.local')

# Configurar Supabase
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Faltan variables de entorno de Supabase")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def convert_array_column(value):
    """Convierte string separado por | a array de PostgreSQL"""
    if pd.isna(value) or value == '':
        return None
    # Dividir por | y limpiar espacios
    return [item.strip() for item in str(value).split('|')]

def convert_json_column(value):
    """Convierte string JSON a objeto Python"""
    if pd.isna(value) or value == '':
        return None
    try:
        if isinstance(value, str):
            return json.loads(value)
        return value
    except json.JSONDecodeError:
        print(f"⚠️  Warning: Could not parse JSON: {value}")
        return None

def upload_productos_base(excel_file):
    """Sube productos base desde Excel"""
    print("📊 Leyendo productos base desde Excel...")
    df = pd.read_excel(excel_file, sheet_name='PRODUCTOS_BASE')

    print(f"✓ Encontrados {len(df)} productos")

    # Convertir arrays (pros, cons, etc.)
    if 'pros' in df.columns:
        df['pros'] = df['pros'].apply(convert_array_column)
    if 'cons' in df.columns:
        df['cons'] = df['cons'].apply(convert_array_column)

    # Convertir a lista de diccionarios
    productos = df.to_dict('records')

    # Subir a Supabase
    for i, producto in enumerate(productos, 1):
        try:
            # Limpiar valores NaN
            producto_limpio = {
                k: (None if pd.isna(v) else v)
                for k, v in producto.items()
            }

            # Upsert (insertar o actualizar)
            result = supabase.table('productos').upsert(
                producto_limpio,
                on_conflict='id'
            ).execute()

            print(f"✓ {i}/{len(productos)}: {producto['nombre']}")

        except Exception as e:
            print(f"❌ Error en producto {producto.get('nombre', 'Unknown')}: {str(e)}")

    print(f"\n✅ Subidos {len(productos)} productos base")

def upload_productos_inversion(excel_file):
    """Actualiza productos de inversión con campos específicos"""
    print("\n📊 Actualizando productos de inversión...")

    try:
        df = pd.read_excel(excel_file, sheet_name='PRODUCTOS_INVERSION')
    except ValueError:
        print("⚠️  Pestaña PRODUCTOS_INVERSION no encontrada, saltando...")
        return

    # Convertir arrays
    if 'requisitos' in df.columns:
        df['requisitos'] = df['requisitos'].apply(convert_array_column)
    if 'comisiones' in df.columns:
        df['comisiones'] = df['comisiones'].apply(convert_array_column)

    productos = df.to_dict('records')

    for i, producto in enumerate(productos, 1):
        try:
            id_producto = producto.pop('id_producto')

            # Limpiar valores NaN
            update_data = {
                k: (None if pd.isna(v) else v)
                for k, v in producto.items()
            }

            result = supabase.table('productos').update(update_data).eq('id', id_producto).execute()

            print(f"✓ {i}/{len(productos)}: Actualizado producto inversión {id_producto}")

        except Exception as e:
            print(f"❌ Error: {str(e)}")

    print(f"\n✅ Actualizados {len(productos)} productos de inversión")

def upload_productos_credito(excel_file):
    """Actualiza productos de crédito con campos específicos"""
    print("\n📊 Actualizando productos de crédito...")

    try:
        df = pd.read_excel(excel_file, sheet_name='PRODUCTOS_CREDITO')
    except ValueError:
        print("⚠️  Pestaña PRODUCTOS_CREDITO no encontrada, saltando...")
        return

    # Convertir arrays
    if 'requisitos' in df.columns:
        df['requisitos'] = df['requisitos'].apply(convert_array_column)
    if 'comisiones' in df.columns:
        df['comisiones'] = df['comisiones'].apply(convert_array_column)

    productos = df.to_dict('records')

    for i, producto in enumerate(productos, 1):
        try:
            id_producto = producto.pop('id_producto')

            # Limpiar valores NaN
            update_data = {
                k: (None if pd.isna(v) else v)
                for k, v in producto.items()
            }

            result = supabase.table('productos').update(update_data).eq('id', id_producto).execute()

            print(f"✓ {i}/{len(productos)}: Actualizado producto crédito {id_producto}")

        except Exception as e:
            print(f"❌ Error: {str(e)}")

    print(f"\n✅ Actualizados {len(productos)} productos de crédito")

def upload_productos_financiamiento(excel_file):
    """Actualiza productos de financiamiento con campos específicos"""
    print("\n📊 Actualizando productos de financiamiento...")

    try:
        df = pd.read_excel(excel_file, sheet_name='PRODUCTOS_FINANCIAMIENTO')
    except ValueError:
        print("⚠️  Pestaña PRODUCTOS_FINANCIAMIENTO no encontrada, saltando...")
        return

    # Convertir arrays
    if 'tiendas_participantes' in df.columns:
        df['tiendas_participantes'] = df['tiendas_participantes'].apply(convert_array_column)
    if 'requisitos' in df.columns:
        df['requisitos'] = df['requisitos'].apply(convert_array_column)
    if 'costos_adicionales' in df.columns:
        df['costos_adicionales'] = df['costos_adicionales'].apply(convert_array_column)
    if 'ideal_para' in df.columns:
        df['ideal_para'] = df['ideal_para'].apply(convert_array_column)

    # Convertir JSON
    if 'tips_raisket' in df.columns:
        df['tips_raisket'] = df['tips_raisket'].apply(convert_json_column)
    if 'contacto' in df.columns:
        df['contacto'] = df['contacto'].apply(convert_json_column)

    productos = df.to_dict('records')

    for i, producto in enumerate(productos, 1):
        try:
            id_producto = producto.pop('id_producto')

            # Limpiar valores NaN
            update_data = {
                k: (None if pd.isna(v) else v)
                for k, v in producto.items()
            }

            result = supabase.table('productos').update(update_data).eq('id', id_producto).execute()

            print(f"✓ {i}/{len(productos)}: Actualizado producto financiamiento {id_producto}")

        except Exception as e:
            print(f"❌ Error: {str(e)}")

    print(f"\n✅ Actualizados {len(productos)} productos de financiamiento")

def main():
    if len(sys.argv) < 2:
        print("Uso: python scripts/upload-excel-to-supabase.py ruta/al/archivo.xlsx")
        sys.exit(1)

    excel_file = sys.argv[1]

    if not os.path.exists(excel_file):
        print(f"❌ Error: Archivo no encontrado: {excel_file}")
        sys.exit(1)

    print(f"🚀 Iniciando carga desde: {excel_file}\n")

    # Subir datos
    upload_productos_base(excel_file)
    upload_productos_inversion(excel_file)
    upload_productos_credito(excel_file)
    upload_productos_financiamiento(excel_file)

    print("\n🎉 ¡Carga completada!")

if __name__ == "__main__":
    main()
