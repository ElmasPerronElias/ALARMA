from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from timbre import views  # ← Cambia de "from . import views" a "from timbre import views"

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # APIs de autenticación
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # APIs del sistema - definidas directamente aquí
    path('api/dashboard/', views.api_dashboard, name='api_dashboard'),
    path('api/dispositivos/', views.api_dispositivos_list, name='api_dispositivos'),
    path('api/horarios/', views.api_horarios_list, name='api_horarios'),
    path('api/sedes/', views.api_sedes_list, name='api_sedes'),
    path('api/register/', views.api_register, name='register'),
    path('api/dispositivo/registro/', views.dispositivo_registro, name='api_registro'),
    
    # Vistas de templates (no usar /api/)
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('register/', views.register_view, name='register'),
]