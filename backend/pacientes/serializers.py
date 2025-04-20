from rest_framework import serializers
from backend.pacientes.models import Paciente, Mobilidade, ForcaMuscular, EscalaseQuestionários, TesteFuncao, TodosTestes, ModeloPresetado, HistoricoClinico


class ModeloPresetadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeloPresetado
        fields = ['id', 'nome', 'conteudo']


class HistoricoClinicoSerializer(serializers.ModelSerializer):
    modelo_presetado = ModeloPresetadoSerializer(read_only=True)

    class Meta:
        model = HistoricoClinico
        fields = ['id', 'paciente', 'data_avaliacao', 'conteudo', 'modelo_presetado']
        
class TodosTestesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodosTestes
        fields = ['nome']  # Inclua outros campos, se necessário

class TesteFuncaoSerializer(serializers.ModelSerializer):
    teste = TodosTestesSerializer(read_only=True)  # Agora retorna o objeto completo

    class Meta:
        model = TesteFuncao
        fields = ['teste', 'data_avaliacao', 'lado_esquerdo', 'lado_direito']

class EscalaseQuestionáriosSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalaseQuestionários
        fields = ['nome', 'data_avaliacao', 'resultado']

class MobilidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mobilidade
        fields = '__all__'

class ForcaMuscularSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForcaMuscular
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    mobilidades = MobilidadeSerializer(many=True, read_only=True)
    dadosdeforcamuscular = ForcaMuscularSerializer(many=True, read_only=True)
    escalasequestionarios = EscalaseQuestionáriosSerializer(many=True, read_only=True)
    dadosdetestes = TesteFuncaoSerializer(many=True, read_only=True)
    idade = serializers.SerializerMethodField()  # Adicionar o campo idade

    class Meta:
        model = Paciente
        fields = ['id', 'nome', 'data_nascimento', 'cpf', 'data_cadastro', 'idade', 'mobilidades', 'dadosdeforcamuscular', 'escalasequestionarios', 'dadosdetestes']  # Inclua o campo idade

    def get_idade(self, obj):
        return obj.idade  # Retorna a propriedade idade do modelo
