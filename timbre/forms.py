from django import forms
from .models import Sede, Dispositivo, HorarioEscolar, Institucion, EventoHorario, ComandoRemoto

class SedeForm(forms.ModelForm):
    class Meta:
        model = Sede
        fields = ['nombre', 'codigo', 'institucion', 'direccion', 'telefono', 'activo']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Sede Principal'}),
            'codigo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Código único'}),
            'institucion': forms.Select(attrs={'class': 'form-control'}),
            'direccion': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Dirección completa'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Teléfono de contacto'}),
            'activo': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'nombre': 'Nombre de la sede',
            'codigo': 'Código',
            'institucion': 'Institución',
            'direccion': 'Dirección',
            'telefono': 'Teléfono',
            'activo': '¿Activa?',
        }

class DispositivoForm(forms.ModelForm):
    class Meta:
        model = Dispositivo
        fields = ['codigo_dispositivo', 'nombre', 'sede', 'estado', 'activo']
        widgets = {
            'codigo_dispositivo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: TIMBRE_01'}),
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Timbre Principal'}),
            'sede': forms.Select(attrs={'class': 'form-control'}),
            'estado': forms.Select(attrs={'class': 'form-control'}),
            'activo': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'codigo_dispositivo': 'Código del dispositivo',
            'nombre': 'Nombre',
            'sede': 'Sede',
            'estado': 'Estado',
            'activo': '¿Activo?',
        }



class HorarioEscolarForm(forms.ModelForm):
    class Meta:
        model = HorarioEscolar
        fields = ['nombre', 'sede', 'fecha_inicio', 'fecha_fin', 'tipo_jornada', 'activo']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Horario Matutino'}),
            'sede': forms.Select(attrs={'class': 'form-control'}),
            'fecha_inicio': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'fecha_fin': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'tipo_jornada': forms.Select(attrs={'class': 'form-control'}),
            'activo': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'nombre': 'Nombre del horario',
            'sede': 'Sede',
            'fecha_inicio': 'Fecha de inicio',
            'fecha_fin': 'Fecha de fin',
            'tipo_jornada': 'Tipo de jornada',
            'activo': '¿Activo?',
        }

class InstitucionForm(forms.ModelForm):
    class Meta:
        model = Institucion
        fields = ['nombre', 'ruc', 'activo']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Colegio San José'}),
            'ruc': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '12345678901'}),
            'activo': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'nombre': 'Nombre de la institución',
            'ruc': 'RUC',
            'activo': '¿Activa?',
        }

class EventoHorarioForm(forms.ModelForm):
    class Meta:
        model = EventoHorario
        fields = ['nombre', 'horario_escolar', 'tipo_evento', 'dia_semana', 'hora_inicio', 'duracion_segundos', 'activo']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej: Entrada mañana'}),
            'horario_escolar': forms.Select(attrs={'class': 'form-control'}),
            'tipo_evento': forms.Select(attrs={'class': 'form-control'}),
            'dia_semana': forms.Select(attrs={'class': 'form-control'}),
            'hora_inicio': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'duracion_segundos': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': '5'}),
            'activo': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'nombre': 'Nombre del evento',
            'horario_escolar': 'Horario escolar',
            'tipo_evento': 'Tipo de evento',
            'dia_semana': 'Día de la semana',
            'hora_inicio': 'Hora de inicio',
            'duracion_segundos': 'Duración (segundos)',
            'activo': '¿Activo?',
        }

class ComandoRemotoForm(forms.ModelForm):
    class Meta:
        model = ComandoRemoto
        fields = ['dispositivo', 'tipo_comando', 'parametros', 'estado']
        widgets = {
            'dispositivo': forms.Select(attrs={'class': 'form-control'}),
            'tipo_comando': forms.Select(attrs={'class': 'form-control'}),
            'parametros': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': '{"duracion": 5}'}),
            'estado': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'dispositivo': 'Dispositivo',
            'tipo_comando': 'Tipo de comando',
            'parametros': 'Parámetros (JSON)',
            'estado': 'Estado',
        }