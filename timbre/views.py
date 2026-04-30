# views.py - Elimina @login_required de las APIs

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
import json

from .models import (
    Institucion, Sede, Usuario, Dispositivo,
    HorarioEscolar, EventoHorario, ActivacionTimbre
)

# ============================================
# API PARA ANGULAR - SIN AUTENTICACIÓN (por ahora)
# ============================================

# Elimina @login_required de estas funciones
def api_dashboard(request):
    """API para datos del dashboard"""
    data = {
        'total_dispositivos': Dispositivo.objects.filter(activo=True).count(),
        'dispositivos_conectados': Dispositivo.objects.filter(activo=True).count(),
        'total_sedes': Sede.objects.filter(activo=True).count(),
        'total_usuarios': Usuario.objects.filter(activo=True).count(),
        'eventos_hoy': EventoHorario.objects.filter(
            horario_escolar__activo=True,
            activo=True
        ).count(),
    }
    return JsonResponse(data)


def api_dispositivos_list(request):
    """API - Lista de dispositivos"""
    dispositivos = Dispositivo.objects.filter(activo=True)
    data = []
    for d in dispositivos:
        data.append({
            'id': d.id,
            'nombre': d.nombre,
            'codigo': d.codigo_dispositivo,
            'tipo': d.tipo,
            'sede': d.sede.nombre,
            'conectado': d.esta_conectado(),
        })
    return JsonResponse({'dispositivos': data})


def api_horarios_list(request):
    """API - Lista de horarios escolares"""
    horarios = HorarioEscolar.objects.filter(activo=True)
    data = []
    for h in horarios:
        data.append({
            'id': h.id,
            'nombre': h.nombre,
            'sede': h.sede.nombre,
            'tipo_jornada': h.tipo_jornada,
        })
    return JsonResponse({'horarios': data})


def api_sedes_list(request):
    """API - Lista de sedes"""
    sedes = Sede.objects.filter(activo=True)
    data = []
    for s in sedes:
        data.append({
            'id': s.id,
            'nombre': s.nombre,
            'codigo': s.codigo,
            'institucion': s.institucion.nombre,
        })
    return JsonResponse({'sedes': data})


# ============================================
# APIs para ESP32 (sin autenticación)
# ============================================

@csrf_exempt
@require_http_methods(["POST"])
def dispositivo_registro(request):
    """Registro de dispositivo ESP32"""
    try:
        data = json.loads(request.body)
        codigo = data.get('codigo_dispositivo')
        ip = request.META.get('REMOTE_ADDR')
        
        dispositivo = Dispositivo.objects.get(codigo_dispositivo=codigo)
        dispositivo.ip_address = ip
        dispositivo.ultima_conexion = timezone.now()
        dispositivo.save()
        
        return JsonResponse({
            'status': 'ok',
            'mensaje': 'Dispositivo registrado',
            'configuracion': {
                'id': dispositivo.id,
                'nombre': dispositivo.nombre,
                'sede': dispositivo.sede.nombre,
            }
        })
    except Dispositivo.DoesNotExist:
        return JsonResponse({'status': 'error', 'mensaje': 'Dispositivo no encontrado'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'mensaje': str(e)}, status=400)