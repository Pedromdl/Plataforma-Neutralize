"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from backend.pacientes.views import SalvarPacienteView, BuscarPacientesView, ModeloPresetadoView, HistoricoClinicoView, index


urlpatterns = [
    path('admin/', admin.site.urls),
    path('salvar-paciente/', SalvarPacienteView.as_view(), name='salvar-paciente'),
    path('buscar-pacientes/', BuscarPacientesView.as_view(), name='buscar-pacientes'),
    path('modelos-presetados/', ModeloPresetadoView.as_view(), name='modelos-presetados'),
    path('modelos-presetados/<int:modelo_id>/', ModeloPresetadoView.as_view(), name='obter_modelo_presetado'),
    path('historicos-clinicos/', HistoricoClinicoView.as_view(), name='criar-historico-clinico'),

    path('', index, name='index'),
]
    
