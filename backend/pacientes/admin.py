from django.contrib import admin
from .models import (
    Paciente, Mobilidade, ForcaMuscular, EscalaseQuestionários,
    TodosTestes, CategoriaTeste, TesteFuncao, ModeloPresetado, HistoricoClinico
)

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'data_nascimento', 'cpf', 'data_cadastro', 'idade')
    search_fields = ('nome', 'cpf')
    list_filter = ('data_cadastro',)

@admin.register(Mobilidade)
class MobilidadeAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'nome', 'data_avaliacao', 'lado_esquerdo', 'lado_direito', 'observacao')
    search_fields = ('paciente__nome', 'nome')
    list_filter = ('paciente__nome', 'data_avaliacao')

@admin.register(ForcaMuscular)
class ForcaMuscularAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'musculatura', 'data_avaliacao', 'lado_esquerdo', 'lado_direito', 'observacao')
    search_fields = ('paciente__nome', 'musculatura')
    list_filter = ('paciente__nome', 'data_avaliacao')

@admin.register(EscalaseQuestionários)
class EscalaseQuestionáriosAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'nome', 'data_avaliacao', 'resultado')
    search_fields = ('paciente__nome', 'nome')
    list_filter = ('paciente__nome', 'data_avaliacao')

@admin.register(ModeloPresetado)
class ModeloPresetadoAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(HistoricoClinico)
class HistoricoClinicoAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'data_avaliacao', 'modelo_presetado')
    search_fields = ('paciente__nome', 'modelo_presetado__nome')
    list_filter = ('data_avaliacao',)

@admin.register(CategoriaTeste)
class CategoriaTesteAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)

@admin.register(TodosTestes)
class TodosTestesAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria')
    search_fields = ('nome',)
    list_filter = ('categoria',)

@admin.register(TesteFuncao)
class TesteFuncaoAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'teste', 'data_avaliacao', 'lado_esquerdo', 'lado_direito', 'observacao')
    search_fields = ('paciente__nome', 'teste__nome')
    list_filter = ('paciente__nome', 'teste', 'data_avaliacao')