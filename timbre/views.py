import json
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model

from .models import (
    Institucion, Sede, Usuario, Dispositivo,
    HorarioEscolar, EventoHorario, ActivacionTimbre, EstadoDispositivo
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
# ========== CRUD COMPLETO ==========
# ============================================

# ---------- INSTITUCIONES ----------
@csrf_exempt
def institucion_list(request):
    """Listar todas las instituciones o crear una nueva"""
    if request.method == 'GET':
        instituciones = Institucion.objects.all()
        data = []
        for i in instituciones:
            data.append({
                'id': i.id,
                'nombre': i.nombre,
                'ruc': i.ruc,
                'telefono': i.telefono,
                'email': i.email,
                'direccion': i.direccion,
                'activo': i.activo,
                'fecha_registro': i.fecha_registro,
            })
        return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            institucion = Institucion.objects.create(
                nombre=data['nombre'],
                ruc=data.get('ruc', ''),
                telefono=data.get('telefono', ''),
                email=data.get('email', ''),
                direccion=data.get('direccion', ''),
                activo=data.get('activo', True)
            )
            return JsonResponse({'id': institucion.id, 'message': 'Institución creada exitosamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def institucion_detail(request, pk):
    """Obtener, actualizar o eliminar una institución específica"""
    try:
        institucion = Institucion.objects.get(pk=pk)
    except Institucion.DoesNotExist:
        return JsonResponse({'error': 'Institución no encontrada'}, status=404)

    if request.method == 'GET':
        data = {
            'id': institucion.id,
            'nombre': institucion.nombre,
            'ruc': institucion.ruc,
            'telefono': institucion.telefono,
            'email': institucion.email,
            'direccion': institucion.direccion,
            'activo': institucion.activo,
            'fecha_registro': institucion.fecha_registro,
        }
        return JsonResponse(data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            institucion.nombre = data.get('nombre', institucion.nombre)
            institucion.ruc = data.get('ruc', institucion.ruc)
            institucion.telefono = data.get('telefono', institucion.telefono)
            institucion.email = data.get('email', institucion.email)
            institucion.direccion = data.get('direccion', institucion.direccion)
            institucion.activo = data.get('activo', institucion.activo)
            institucion.save()
            return JsonResponse({'message': 'Institución actualizada exitosamente'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        institucion.delete()
        return JsonResponse({'message': 'Institución eliminada exitosamente'})


# ---------- SEDES ----------
@csrf_exempt
def sede_list(request):
    """Listar todas las sedes o crear una nueva"""
    if request.method == 'GET':
        sedes = Sede.objects.all()
        data = []
        for s in sedes:
            data.append({
                'id': s.id,
                'nombre': s.nombre,
                'codigo': s.codigo,
                'institucion': s.institucion.id,
                'institucion_nombre': s.institucion.nombre,
                'direccion': s.direccion,
                'telefono': s.telefono,
                'activo': s.activo,
            })
        return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            institucion = Institucion.objects.get(id=data['institucion'])
            sede = Sede.objects.create(
                institucion=institucion,
                nombre=data['nombre'],
                codigo=data['codigo'],
                direccion=data['direccion'],
                telefono=data.get('telefono', ''),
                activo=data.get('activo', True)
            )
            return JsonResponse({'id': sede.id, 'message': 'Sede creada exitosamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def sede_detail(request, pk):
    """Obtener, actualizar o eliminar una sede específica"""
    try:
        sede = Sede.objects.get(pk=pk)
    except Sede.DoesNotExist:
        return JsonResponse({'error': 'Sede no encontrada'}, status=404)

    if request.method == 'GET':
        data = {
            'id': sede.id,
            'nombre': sede.nombre,
            'codigo': sede.codigo,
            'institucion': sede.institucion.id,
            'institucion_nombre': sede.institucion.nombre,
            'direccion': sede.direccion,
            'telefono': sede.telefono,
            'activo': sede.activo,
        }
        return JsonResponse(data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            sede.nombre = data.get('nombre', sede.nombre)
            sede.codigo = data.get('codigo', sede.codigo)
            sede.direccion = data.get('direccion', sede.direccion)
            sede.telefono = data.get('telefono', sede.telefono)
            sede.activo = data.get('activo', sede.activo)
            if 'institucion' in data:
                sede.institucion = Institucion.objects.get(id=data['institucion'])
            sede.save()
            return JsonResponse({'message': 'Sede actualizada exitosamente'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        sede.delete()
        return JsonResponse({'message': 'Sede eliminada exitosamente'})


# ---------- DISPOSITIVOS ----------
@csrf_exempt
def dispositivo_list(request):
    """Listar todos los dispositivos o crear uno nuevo"""
    if request.method == 'GET':
        dispositivos = Dispositivo.objects.all()
        data = []
        for d in dispositivos:
            # Obtener estado por defecto si no tiene
            estado = d.estado
            if not estado:
                estado = EstadoDispositivo.objects.first()
            data.append({
                'id': d.id,
                'nombre': d.nombre,
                'codigo_dispositivo': d.codigo_dispositivo,
                'tipo': d.tipo,
                'sede': d.sede.id,
                'sede_nombre': d.sede.nombre,
                'estado': estado.id if estado else None,
                'ip_address': d.ip_address,
                'activo': d.activo,
            })
        return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            sede = Sede.objects.get(id=data['sede'])
            dispositivo = Dispositivo.objects.create(
                sede=sede,
                nombre=data['nombre'],
                codigo_dispositivo=data['codigo_dispositivo'],
                tipo=data.get('tipo', 'ESP32'),
                ip_address=data.get('ip_address', ''),
                activo=data.get('activo', True)
            )
            return JsonResponse({'id': dispositivo.id, 'message': 'Dispositivo creado exitosamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def dispositivo_detail(request, pk):
    """Obtener, actualizar o eliminar un dispositivo específico"""
    try:
        dispositivo = Dispositivo.objects.get(pk=pk)
    except Dispositivo.DoesNotExist:
        return JsonResponse({'error': 'Dispositivo no encontrado'}, status=404)

    if request.method == 'GET':
        estado = dispositivo.estado
        if not estado:
            estado = EstadoDispositivo.objects.first()
        data = {
            'id': dispositivo.id,
            'nombre': dispositivo.nombre,
            'codigo_dispositivo': dispositivo.codigo_dispositivo,
            'tipo': dispositivo.tipo,
            'sede': dispositivo.sede.id,
            'sede_nombre': dispositivo.sede.nombre,
            'estado': estado.id if estado else None,
            'ip_address': dispositivo.ip_address,
            'activo': dispositivo.activo,
        }
        return JsonResponse(data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            dispositivo.nombre = data.get('nombre', dispositivo.nombre)
            dispositivo.codigo_dispositivo = data.get('codigo_dispositivo', dispositivo.codigo_dispositivo)
            dispositivo.tipo = data.get('tipo', dispositivo.tipo)
            dispositivo.ip_address = data.get('ip_address', dispositivo.ip_address)
            dispositivo.activo = data.get('activo', dispositivo.activo)
            if 'sede' in data:
                dispositivo.sede = Sede.objects.get(id=data['sede'])
            dispositivo.save()
            return JsonResponse({'message': 'Dispositivo actualizado exitosamente'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    elif request.method == 'DELETE':
        dispositivo.delete()
        return JsonResponse({'message': 'Dispositivo eliminado exitosamente'})


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