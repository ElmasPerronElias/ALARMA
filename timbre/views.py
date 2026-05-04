import json
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model

from .models import (
    Institucion, Sede, Usuario, Dispositivo,
    HorarioEscolar, EventoHorario, ActivacionTimbre
)

# Usar el modelo de usuario personalizado
User = get_user_model()


# ============================================
# API PARA ANGULAR - SIN AUTENTICACIÓN
# ============================================

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


@csrf_exempt
@require_http_methods(["POST"])
def api_register(request):
    """API - Registro de usuario"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password2 = data.get('password2')

        if not all([username, email, password, password2]):
            return JsonResponse({'error': 'Todos los campos son requeridos'}, status=400)

        if password != password2:
            return JsonResponse({'error': 'Las contraseñas no coinciden'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'El usuario ya existe'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'El email ya está registrado'}, status=400)

        # Crear usuario con el modelo personalizado
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            numero_documento=data.get('numero_documento', '00000000')
        )
        
        return JsonResponse({'message': 'Usuario registrado exitosamente'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


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


# ============================================
# VISTAS PARA TEMPLATES (con autenticación)
# ============================================

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages

@login_required
def dashboard_view(request):
    """Vista del dashboard principal"""
    context = {
        'total_dispositivos': Dispositivo.objects.filter(activo=True).count(),
        'total_sedes': Sede.objects.filter(activo=True).count(),
        'total_usuarios': Usuario.objects.filter(activo=True).count(),
        'eventos_hoy': EventoHorario.objects.filter(
            horario_escolar__activo=True,
            activo=True
        ).count(),
        'ultimas_activaciones': ActivacionTimbre.objects.select_related('dispositivo').order_by('-fecha_programada')[:5],
    }
    return render(request, 'timbre/dashboard.html', context)


def register_view(request):
    """Vista para registro de usuarios"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})