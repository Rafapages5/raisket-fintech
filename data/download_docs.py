#!/usr/bin/env python3
"""
Script para descargar documentos financieros mexicanos desde URLs configuradas.
Verifica que los PDFs sean texto (no escaneados) y genera metadata automáticamente.
"""

import json
import os
import csv
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple
import PyPDF2
import io
import sys
import time

class DocumentDownloader:
    def __init__(self, config_path: str = "urls_config.json"):
        self.config_path = config_path
        self.base_dir = Path(__file__).parent
        self.metadata = []
        self.stats = {
            "total": 0,
            "downloaded": 0,
            "failed": 0,
            "skipped": 0,
            "text_valid": 0,
            "scanned": 0
        }

    def load_config(self) -> Dict:
        """Carga la configuración de URLs desde el JSON"""
        with open(self.base_dir / self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_folder_mapping(self) -> Dict[str, str]:
        """Mapea las fuentes a sus carpetas correspondientes"""
        return {
            "SAT": "sat",
            "CNBV": "cnbv",
            "Banxico": "banxico",
            "Condusef": "condusef",
            "CETES_Afores": "cetes_afores"
        }

    def sanitize_filename(self, titulo: str) -> str:
        """Limpia el título para usarlo como nombre de archivo"""
        # Remueve caracteres no válidos
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            titulo = titulo.replace(char, '')
        # Limita la longitud
        return titulo[:100].strip()

    def verify_pdf_is_text(self, pdf_content: bytes) -> Tuple[bool, int]:
        """
        Verifica si un PDF contiene texto extraíble (no es escaneado).
        Retorna (es_texto, num_palabras)
        """
        try:
            pdf_file = io.BytesIO(pdf_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            total_words = 0
            pages_checked = min(3, len(pdf_reader.pages))  # Verifica primeras 3 páginas

            for i in range(pages_checked):
                page = pdf_reader.pages[i]
                text = page.extract_text()
                words = len(text.split())
                total_words += words

            # Si tiene al menos 50 palabras en las primeras páginas, es texto válido
            is_text = total_words > 50
            return is_text, total_words

        except Exception as e:
            print(f"      ⚠ Error verificando PDF: {str(e)}")
            return False, 0

    def download_file(self, url: str, destination: Path) -> Tuple[bool, str]:
        """
        Descarga un archivo desde una URL.
        Retorna (éxito, mensaje)
        """
        try:
            # Headers para simular un navegador
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }

            response = requests.get(url, headers=headers, timeout=30, stream=True)
            response.raise_for_status()

            # Descarga el contenido
            content = response.content

            # Verifica que sea un PDF válido
            if not content.startswith(b'%PDF'):
                return False, "El archivo no es un PDF válido"

            # Verifica que tenga texto
            is_text, word_count = self.verify_pdf_is_text(content)

            if not is_text:
                self.stats["scanned"] += 1
                return False, f"PDF escaneado (solo {word_count} palabras detectadas)"

            # Guarda el archivo
            with open(destination, 'wb') as f:
                f.write(content)

            self.stats["text_valid"] += 1
            return True, f"Descargado exitosamente ({word_count} palabras)"

        except requests.exceptions.Timeout:
            return False, "Timeout - El servidor no respondió"
        except requests.exceptions.RequestException as e:
            return False, f"Error de descarga: {str(e)}"
        except Exception as e:
            return False, f"Error inesperado: {str(e)}"

    def process_documents(self):
        """Procesa todos los documentos del config"""
        print("=" * 70)
        print("  DESCARGADOR DE DOCUMENTOS FINANCIEROS MEXICANOS")
        print("=" * 70)
        print()

        # Carga configuración
        try:
            config = self.load_config()
        except FileNotFoundError:
            print("❌ Error: No se encontró urls_config.json")
            return
        except json.JSONDecodeError:
            print("❌ Error: urls_config.json no es un JSON válido")
            return

        folder_mapping = self.get_folder_mapping()

        # Procesa cada fuente
        for source, documents in config.items():
            print(f"\n📁 Procesando: {source}")
            print("-" * 70)

            if source not in folder_mapping:
                print(f"  ⚠ Fuente desconocida, saltando...")
                continue

            folder = self.base_dir / folder_mapping[source]
            folder.mkdir(exist_ok=True)

            # Procesa cada documento
            for idx, doc in enumerate(documents, 1):
                self.stats["total"] += 1
                titulo = doc.get("titulo", f"documento_{idx}")
                url = doc.get("url", "")
                categoria = doc.get("categoria", "general")
                descripcion = doc.get("descripcion", "")

                print(f"\n  [{idx}/{len(documents)}] {titulo}")

                # Verifica si la URL es válida
                if not url or url == "REEMPLAZAR_CON_URL_REAL":
                    print(f"      ⏭  Saltando - URL no configurada")
                    self.stats["skipped"] += 1
                    continue

                # Genera nombre de archivo
                filename = self.sanitize_filename(titulo) + ".pdf"
                filepath = folder / filename

                # Verifica si ya existe
                if filepath.exists():
                    print(f"      ✓ Ya existe - Saltando")
                    self.stats["skipped"] += 1
                    # Agrega a metadata aunque ya exista
                    self.add_metadata(titulo, source, categoria, descripcion,
                                    str(filepath.relative_to(self.base_dir)))
                    continue

                # Descarga el archivo
                print(f"      ⬇ Descargando...")
                success, message = self.download_file(url, filepath)

                if success:
                    print(f"      ✓ {message}")
                    self.stats["downloaded"] += 1
                    # Agrega metadata
                    self.add_metadata(titulo, source, categoria, descripcion,
                                    str(filepath.relative_to(self.base_dir)))
                else:
                    print(f"      ❌ {message}")
                    self.stats["failed"] += 1

                # Pausa breve para no saturar servidores
                time.sleep(1)

        # Guarda metadata
        self.save_metadata()

        # Muestra estadísticas
        self.print_stats()

    def add_metadata(self, titulo: str, fuente: str, categoria: str,
                     descripcion: str, ruta_archivo: str):
        """Agrega un registro de metadata"""
        self.metadata.append({
            "titulo": titulo,
            "fuente": fuente,
            "fecha_descarga": datetime.now().strftime("%Y-%m-%d"),
            "categoria": categoria,
            "descripcion": descripcion,
            "ruta_archivo": ruta_archivo
        })

    def save_metadata(self):
        """Guarda la metadata en CSV"""
        metadata_path = self.base_dir / "metadata.csv"

        if not self.metadata:
            print("\n⚠ No hay metadata para guardar")
            return

        with open(metadata_path, 'w', newline='', encoding='utf-8') as f:
            fieldnames = ["titulo", "fuente", "fecha_descarga", "categoria",
                         "descripcion", "ruta_archivo"]
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.metadata)

        print(f"\n📊 Metadata guardada en: {metadata_path}")

    def print_stats(self):
        """Imprime estadísticas finales"""
        print("\n" + "=" * 70)
        print("  RESUMEN DE DESCARGA")
        print("=" * 70)
        print(f"\n  Total de documentos:        {self.stats['total']}")
        print(f"  ✓ Descargados:              {self.stats['downloaded']}")
        print(f"  ⏭  Saltados:                 {self.stats['skipped']}")
        print(f"  ❌ Fallidos:                 {self.stats['failed']}")
        print(f"\n  📄 PDFs con texto válido:   {self.stats['text_valid']}")
        print(f"  🖼  PDFs escaneados:          {self.stats['scanned']}")
        print("\n" + "=" * 70)

        if self.stats["scanned"] > 0:
            print("\n⚠ ADVERTENCIA: Se detectaron PDFs escaneados.")
            print("  Estos documentos no se descargaron porque necesitarían OCR.")
            print("  Busca versiones en texto de estos documentos.")

def main():
    """Función principal"""
    downloader = DocumentDownloader()

    try:
        downloader.process_documents()
    except KeyboardInterrupt:
        print("\n\n⚠ Descarga interrumpida por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
