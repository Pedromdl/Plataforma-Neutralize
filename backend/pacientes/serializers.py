from rest_framework import serializers
from datetime import date
from pacientes.models import Paciente, RegiaoDor, RegistroSessao, Mobilidade, ForcaMuscular, EscalaseQuestionários, TesteFuncao, TodosTestes, ModeloPresetado, HistoricoClinico, Agendamento


class AgendamentoSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.CharField(source='paciente.nome', read_only=True)  # Adiciona o nome do paciente

    class Meta:
        model = Agendamento
        fields = '__all__'
        extra_fields = ['paciente_nome']  # Inclui o campo personalizado

class ModeloPresetadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeloPresetado
        fields = ['id', 'nome', 'conteudo']


class HistoricoClinicoSerializer(serializers.ModelSerializer):
    modelo_presetado = ModeloPresetadoSerializer(read_only=True)
    semanas_desde_avaliacao = serializers.SerializerMethodField()

    class Meta:
        model = HistoricoClinico
        fields = ['id', 'paciente', 'data_avaliacao', 'conteudo', 'modelo_presetado', 'semanas_desde_avaliacao']

    def get_semanas_desde_avaliacao(self, obj):
        # Calcula a diferença em semanas entre a data de avaliação e a data atual
        diferenca_dias = (date.today() - obj.data_avaliacao).days
        return diferenca_dias // 7
        
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

class RegiaoDorSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegiaoDor
        fields = ['id', 'regiao', 'valor']

class RegistroSessaoSerializer(serializers.ModelSerializer):
    regioes = RegiaoDorSerializer(many=True, write_only=True)
    regioes_info = RegiaoDorSerializer(source='regioes', many=True, read_only=True)

    class Meta:
        model = RegistroSessao
        fields = ['id', 'paciente', 'data', 'observacoes', 'regioes', 'regioes_info']
        read_only_fields = ['id', 'data', 'regioes_info']

    def create(self, validated_data):
        regioes_data = validated_data.pop('regioes')
        registro = RegistroSessao.objects.create(**validated_data)
        for regiao_data in regioes_data:
            RegiaoDor.objects.create(registro=registro, **regiao_data)
        return registro

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Inclui as regiões de dor no retorno
        rep['regioes'] = RegiaoDorSerializer(instance.regioes.all(), many=True).data
        return rep