from rest_framework import serializers
from .models import Institucion, Sede, Dispositivo, HorarioEscolar, EventoHorario, EstadoDispositivo

class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = '__all__'

class SedeSerializer(serializers.ModelSerializer):
    institucion_nombre = serializers.CharField(source='institucion.nombre', read_only=True)
    
    class Meta:
        model = Sede
        fields = '__all__'

class DispositivoSerializer(serializers.ModelSerializer):
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    estado_nombre = serializers.CharField(source='estado.nombre', read_only=True)
    
    class Meta:
        model = Dispositivo
        fields = '__all__'

class HorarioEscolarSerializer(serializers.ModelSerializer):
    sede_nombre = serializers.CharField(source='sede.nombre', read_only=True)
    
    class Meta:
        model = HorarioEscolar
        fields = '__all__'

class EventoHorarioSerializer(serializers.ModelSerializer):
    horario_nombre = serializers.CharField(source='horario_escolar.nombre', read_only=True)
    
    class Meta:
        model = EventoHorario
        fields = '__all__'