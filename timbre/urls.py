from django.urls import path
from . import views

app_name = 'timbre'

urlpatterns = [
    # API para Angular
    path('api/dashboard/', views.api_dashboard, name='api_dashboard'),
    path('api/dispositivos/', views.api_dispositivos_list, name='api_dispositivos'),
    path('api/horarios/', views.api_horarios_list, name='api_horarios'),
    path('api/sedes/', views.api_sedes_list, name='api_sedes'),
    path('api/register/', views.api_register, name='api_register'),
    
    # APIs para ESP32
    path('api/dispositivo/registro/', views.dispositivo_registro, name='api_registro'),
    
    # Vistas con templates
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('register/', views.register_view, name='register'),
]