from rest_framework import serializers
from .models import (
    Institucion, Sede, Dispositivo, HorarioEscolar, EventoHorario,
    ComandoRemoto, Notificacion
)

class InstitucionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institucion
        fields = '__all__'

class SedeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sede
        fields = '__all__'

class DispositivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispositivo
        fields = '__all__'

class HorarioEscolarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioEscolar
        fields = '__all__'

class EventoHorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoHorario
        fields = '__all__'

class ComandoRemotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComandoRemoto
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'