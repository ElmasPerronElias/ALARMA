from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# ============================================
# 1. INSTITUCIÓN
# ============================================
class Institucion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField('Nombre de la institución', max_length=200, unique=True)
    ruc = models.CharField('RUC', max_length=20, unique=True, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.TextField(blank=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Institución'
        verbose_name_plural = 'Instituciones'
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre

# ============================================
# 2. SEDE
# ============================================
class Sede(models.Model):
    id = models.AutoField(primary_key=True)
    institucion = models.ForeignKey(Institucion, on_delete=models.CASCADE, related_name='sedes')
    nombre = models.CharField('Nombre de la sede', max_length=200)
    codigo = models.CharField('Código de sede', max_length=20, unique=True)
    direccion = models.TextField()
    telefono = models.CharField(max_length=20, blank=True)
    latitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    zona_horaria = models.CharField(max_length=50, default='America/Lima')
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Sede'
        verbose_name_plural = 'Sedes'
        unique_together = ['institucion', 'nombre']
        ordering = ['institucion', 'nombre']
    
    def __str__(self):
        return f"{self.institucion.nombre} - {self.nombre}"

# ============================================
# 3. USUARIO CORREGIDO (institución opcional)
# ============================================
class Usuario(AbstractUser):
    TIPO_DOCUMENTO = [
        ('DNI', 'DNI'),
        ('CE', 'Carnet de Extranjería'),
        ('PAS', 'Pasaporte'),
    ]
    
    tipo_documento = models.CharField(max_length=3, choices=TIPO_DOCUMENTO, default='DNI')
    numero_documento = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    sede = models.ForeignKey(Sede, on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')
    institucion = models.ForeignKey(Institucion, on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='timbre_usuario_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='timbre_usuario_permissions',
        blank=True,
    )
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.get_full_name()} - {self.username}"

# ============================================
# 4. ROL
# ============================================
class Rol(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True)
    permisos = models.JSONField(default=dict)
    
    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
    
    def __str__(self):
        return self.nombre

# ============================================
# 5. USUARIO_ROL
# ============================================
class UsuarioRol(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='roles_asignados')
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='usuarios_asignados')
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='asignaciones_rol')
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Asignación de Rol'
        verbose_name_plural = 'Asignaciones de Roles'
        unique_together = ['usuario', 'rol', 'sede']
    
    def __str__(self):
        return f"{self.usuario.username} - {self.rol.nombre} - {self.sede.nombre}"

# ============================================
# 6. ESTADO_DISPOSITIVO
# ============================================
class EstadoDispositivo(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#000000')
    
    class Meta:
        verbose_name = 'Estado del Dispositivo'
        verbose_name_plural = 'Estados de Dispositivos'
    
    def __str__(self):
        return self.nombre

# ============================================
# 7. DISPOSITIVO
# ============================================
class Dispositivo(models.Model):
    TIPO_DISPOSITIVO = [
        ('TIMBRE1', 'Timbre Principal'),
        ('TIMBRE2', 'Timbre Secundario'),
        ('ESP32', 'ESP32'),
        ('CONTROLADOR', 'Controlador Central'),
    ]
    
    id = models.AutoField(primary_key=True)
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='dispositivos')
    estado = models.ForeignKey(EstadoDispositivo, on_delete=models.PROTECT, related_name='dispositivos')
    tipo = models.CharField(max_length=20, choices=TIPO_DISPOSITIVO, default='ESP32')
    nombre = models.CharField(max_length=100)
    codigo_dispositivo = models.CharField(max_length=50, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    ultima_conexion = models.DateTimeField(null=True, blank=True)
    firmware_version = models.CharField(max_length=20, blank=True)
    configuracion_json = models.JSONField(default=dict)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Dispositivo'
        verbose_name_plural = 'Dispositivos'
        ordering = ['sede', 'nombre']
    
    def __str__(self):
        return f"{self.nombre} ({self.codigo_dispositivo}) - {self.sede.nombre}"
    
    def esta_conectado(self):
        if self.ultima_conexion:
            tiempo_transcurrido = timezone.now() - self.ultima_conexion
            return tiempo_transcurrido.seconds < 300
        return False

# ============================================
# 8. HORARIO_ESCOLAR
# ============================================
class HorarioEscolar(models.Model):
    TIPO_JORNADA = [
        ('MANANA', 'Mañana'),
        ('TARDE', 'Tarde'),
        ('NOCHE', 'Noche'),
        ('COMPLETA', 'Jornada Completa'),
    ]
    
    id = models.AutoField(primary_key=True)
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='horarios_escolares')
    nombre = models.CharField(max_length=100)
    tipo_jornada = models.CharField(max_length=20, choices=TIPO_JORNADA, default='MANANA')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activo = models.BooleanField(default=True)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Horario Escolar'
        verbose_name_plural = 'Horarios Escolares'
        ordering = ['-fecha_inicio']
    
    def __str__(self):
        return f"{self.nombre} - {self.sede.nombre} ({self.get_tipo_jornada_display()})"

# ============================================
# 9. EVENTO_HORARIO
# ============================================
class EventoHorario(models.Model):
    DIAS_SEMANA = [
        ('LUN', 'Lunes'),
        ('MAR', 'Martes'),
        ('MIE', 'Miércoles'),
        ('JUE', 'Jueves'),
        ('VIE', 'Viernes'),
        ('SAB', 'Sábado'),
        ('DOM', 'Domingo'),
    ]
    
    TIPO_EVENTO = [
        ('ENTRADA', 'Entrada'),
        ('SALIDA', 'Salida'),
        ('RECREO', 'Recreo'),
        ('CAMBIO_CLASE', 'Cambio de Clase'),
        ('ALMUERZO', 'Almuerzo'),
        ('EMERGENCIA', 'Emergencia'),
    ]
    
    id = models.AutoField(primary_key=True)
    horario_escolar = models.ForeignKey(HorarioEscolar, on_delete=models.CASCADE, related_name='eventos')
    nombre = models.CharField(max_length=100)
    tipo_evento = models.CharField(max_length=20, choices=TIPO_EVENTO)
    dia_semana = models.CharField(max_length=3, choices=DIAS_SEMANA)
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField(null=True, blank=True)
    duracion_segundos = models.IntegerField(default=5)
    activo = models.BooleanField(default=True)
    orden = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = 'Evento de Horario'
        verbose_name_plural = 'Eventos de Horario'
        ordering = ['horario_escolar', 'dia_semana', 'hora_inicio']
    
    def __str__(self):
        return f"{self.nombre} - {self.dia_semana} {self.hora_inicio}"

# ============================================
# 10. ACTIVACION_TIMBRE
# ============================================
class ActivacionTimbre(models.Model):
    ESTADO_ACTIVACION = [
        ('PENDIENTE', 'Pendiente'),
        ('ENVIADO', 'Enviado al dispositivo'),
        ('EJECUTADO', 'Ejecutado'),
        ('FALLIDO', 'Fallido'),
    ]
    
    id = models.AutoField(primary_key=True)
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name='activaciones')
    evento_horario = models.ForeignKey(EventoHorario, on_delete=models.SET_NULL, null=True, related_name='activaciones')
    fecha_programada = models.DateTimeField()
    fecha_ejecucion = models.DateTimeField(null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_ACTIVACION, default='PENDIENTE')
    comando_enviado = models.JSONField(default=dict)
    respuesta = models.TextField(blank=True)
    error_mensaje = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Activación de Timbre'
        verbose_name_plural = 'Activaciones de Timbre'
        ordering = ['-fecha_programada']
    
    def __str__(self):
        return f"Timbre {self.dispositivo.nombre} - {self.fecha_programada}"

# ============================================
# 11. DIAGNOSTICO_DISPOSITIVO
# ============================================
class DiagnosticoDispositivo(models.Model):
    id = models.AutoField(primary_key=True)
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name='diagnosticos')
    temperatura = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    voltaje = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    memoria_libre = models.BigIntegerField(null=True, blank=True)
    uptime = models.BigIntegerField(null=True, blank=True)
    wifi_signal = models.IntegerField(null=True, blank=True)
    estado_detallado = models.JSONField(default=dict)
    fecha_diagnostico = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Diagnóstico de Dispositivo'
        verbose_name_plural = 'Diagnósticos de Dispositivos'
        ordering = ['-fecha_diagnostico']
    
    def __str__(self):
        return f"Diagnóstico {self.dispositivo.nombre} - {self.fecha_diagnostico}"

# ============================================
# 12. COMANDO_REMOTO
# ============================================
class ComandoRemoto(models.Model):
    TIPO_COMANDO = [
        ('TEST', 'Prueba'),
        ('REINICIAR', 'Reiniciar'),
        ('ACTUALIZAR_CONFIG', 'Actualizar Configuración'),
        ('TIMBRE_MANUAL', 'Activar Timbre Manual'),
        ('SILENCIAR', 'Silenciar'),
        ('ACTUALIZAR_FIRMWARE', 'Actualizar Firmware'),
    ]
    
    ESTADO_COMANDO = [
        ('PENDIENTE', 'Pendiente'),
        ('ENVIADO', 'Enviado'),
        ('RECIBIDO', 'Recibido por dispositivo'),
        ('EJECUTADO', 'Ejecutado'),
        ('FALLIDO', 'Fallido'),
    ]
    
    id = models.AutoField(primary_key=True)
    dispositivo = models.ForeignKey(Dispositivo, on_delete=models.CASCADE, related_name='comandos')
    tipo_comando = models.CharField(max_length=30, choices=TIPO_COMANDO)
    parametros = models.JSONField(default=dict)
    estado = models.CharField(max_length=20, choices=ESTADO_COMANDO, default='PENDIENTE')
    fecha_envio = models.DateTimeField(auto_now_add=True)
    fecha_respuesta = models.DateTimeField(null=True, blank=True)
    usuario_emisor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='comandos_enviados')
    
    class Meta:
        verbose_name = 'Comando Remoto'
        verbose_name_plural = 'Comandos Remotos'
        ordering = ['-fecha_envio']
    
    def __str__(self):
        return f"{self.get_tipo_comando_display()} - {self.dispositivo.nombre} - {self.estado}"

# ============================================
# 13. RESPUESTA_COMANDO
# ============================================
class RespuestaComando(models.Model):
    id = models.AutoField(primary_key=True)
    comando = models.OneToOneField(ComandoRemoto, on_delete=models.CASCADE, related_name='respuesta')
    codigo_respuesta = models.IntegerField()
    mensaje = models.TextField()
    datos_extra = models.JSONField(default=dict)
    tiempo_procesamiento_ms = models.IntegerField(null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Respuesta de Comando'
        verbose_name_plural = 'Respuestas de Comandos'
    
    def __str__(self):
        return f"Respuesta a comando {self.comando.id} - Código: {self.codigo_respuesta}"

# ============================================
# 14. NOTIFICACION
# ============================================
class Notificacion(models.Model):
    TIPO_NOTIFICACION = [
        ('INFO', 'Información'),
        ('WARNING', 'Advertencia'),
        ('ERROR', 'Error'),
        ('TIMBRE', 'Activación de Timbre'),
        ('DISPOSITIVO', 'Estado de Dispositivo'),
    ]
    
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='notificaciones')
    sede = models.ForeignKey(Sede, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=20, choices=TIPO_NOTIFICACION)
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    leido = models.BooleanField(default=False)
    fecha_lectura = models.DateTimeField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"{self.titulo} - {self.usuario.username}"