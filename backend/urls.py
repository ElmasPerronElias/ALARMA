from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from timbre import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Autenticación
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # APIs existentes
    path('api/dashboard/', views.api_dashboard, name='api_dashboard'),
    path('api/register/', views.api_register, name='api_register'),
    path('api/dispositivos/', views.api_dispositivos_list, name='api_dispositivos'),
    path('api/horarios/', views.api_horarios_list, name='api_horarios'),
    path('api/sedes/', views.api_sedes_list, name='api_sedes'),
    path('api/dispositivo/registro/', views.dispositivo_registro, name='api_registro'),
    
    # ========== CRUD ENDPOINTS ==========
    path('api/instituciones/', views.institucion_list, name='institucion_list'),
    path('api/instituciones/<int:pk>/', views.institucion_detail, name='institucion_detail'),
    path('api/sedes/', views.sede_list, name='sede_list'),
    path('api/sedes/<int:pk>/', views.sede_detail, name='sede_detail'),
    path('api/dispositivos-crud/', views.dispositivo_list, name='dispositivo_list'),
    path('api/dispositivos-crud/<int:pk>/', views.dispositivo_detail, name='dispositivo_detail'),
    
    # Vistas de templates
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('register/', views.register_view, name='register'),
]