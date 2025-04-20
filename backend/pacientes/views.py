from datetime import date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Paciente, Mobilidade, HistoricoClinico, ModeloPresetado, ForcaMuscular, EscalaseQuestionários
from .serializers import PacienteSerializer, MobilidadeSerializer, HistoricoClinicoSerializer, ModeloPresetadoSerializer
from django.shortcuts import render


def index(request):
    return render(request, 'index.html')

class SalvarPacienteView(APIView):
    def post(self, request):
        paciente_id = request.data.get('paciente')  # Obter o ID do paciente selecionado
        try:
            paciente = Paciente.objects.get(id=paciente_id)  # Buscar o paciente pelo ID
        except Paciente.DoesNotExist:
            return Response({"error": "Paciente não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Processar os dados de mobilidade
        mobilidades_data = request.data.get('mobilidades', [])
        for mobilidade_data in mobilidades_data:
            Mobilidade.objects.create(
                paciente=paciente,
                nome=mobilidade_data['nome'],
                lado_direito=mobilidade_data['lado_direito'],
                lado_esquerdo=mobilidade_data['lado_esquerdo'],
                observacao=mobilidade_data.get('observacao', ''),
                data_avaliacao=date.today()
            )

        # Processar os dados de força muscular
        forcas_data = request.data.get('dadosdeforcamuscular', [])
        for forca_data in forcas_data:
            ForcaMuscular.objects.create(
                paciente=paciente,
                musculatura=forca_data['musculatura'],
                lado_direito=forca_data['lado_direito'],
                lado_esquerdo=forca_data['lado_esquerdo'],
                observacao=forca_data.get('observacao', ''),
                data_avaliacao=date.today()
            )

        # Processar os dados de escalas e questionários
        escalas_data = request.data.get('escalasequestionarios', [])
        for escala_data in escalas_data:
            EscalaseQuestionários.objects.create(
                paciente=paciente,
                nome=escala_data['nome'],
                resultado=escala_data['resultado'],
                data_avaliacao=date.today()
            )

        return Response({"message": "Dados atualizados com sucesso!"}, status=status.HTTP_200_OK)

class BuscarPacientesView(APIView):
    def get(self, request):
        search_term = request.query_params.get('search', None)
        if search_term:
            pacientes = Paciente.objects.filter(nome__icontains=search_term) | Paciente.objects.filter(cpf__icontains=search_term)
        else:
            pacientes = Paciente.objects.all()
        serializer = PacienteSerializer(pacientes, many=True)
        return Response(serializer.data)

class ModeloPresetadoView(APIView):
    def get(self, request, modelo_id=None):
        if modelo_id:  # Verifica se um ID foi passado
            try:
                modelo = ModeloPresetado.objects.get(id=modelo_id)
                serializer = ModeloPresetadoSerializer(modelo)
                return Response(serializer.data)  # Retorna o modelo específico
            except ModeloPresetado.DoesNotExist:
                return Response({"error": "Modelo não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        else:
            modelos = ModeloPresetado.objects.all()
            serializer = ModeloPresetadoSerializer(modelos, many=True)
            return Response(serializer.data)  # Retorna todos os modelos

    def post(self, request):
        serializer = ModeloPresetadoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HistoricoClinicoView(APIView):
    def get(self, request, paciente_id):
        historicos = HistoricoClinico.objects.filter(paciente_id=paciente_id)
        serializer = HistoricoClinicoSerializer(historicos, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            # Obter os dados do request
            paciente_id = request.data.get('paciente')  # ID do paciente
            conteudo = request.data.get('conteudo')  # Conteúdo do Quill
            modelo_presetado_id = request.data.get('modelo_presetado')  # ID do modelo pré-setado (opcional)

            # Validar se o paciente existe
            paciente = Paciente.objects.filter(id=paciente_id).first()
            if not paciente:
                return Response({"error": "Paciente não encontrado."}, status=status.HTTP_404_NOT_FOUND)

            # Validar se o modelo pré-setado existe (se fornecido)
            modelo_presetado = None
            if modelo_presetado_id:
                modelo_presetado = ModeloPresetado.objects.filter(id=modelo_presetado_id).first()
                if not modelo_presetado:
                    return Response({"error": "Modelo pré-setado não encontrado."}, status=status.HTTP_404_NOT_FOUND)

            # Verificar se já existe um histórico para o paciente na data atual
            historico = HistoricoClinico.objects.filter(
                paciente=paciente,
                data_avaliacao=date.today()
            ).first()

            if historico:
                # Atualizar o histórico existente
                historico.conteudo = conteudo
                historico.modelo_presetado = modelo_presetado
                historico.save()
                return Response({"message": "Histórico atualizado com sucesso!", "id": historico.id}, status=status.HTTP_200_OK)
            else:
                # Criar um novo histórico
                historico = HistoricoClinico.objects.create(
                    paciente=paciente,
                    conteudo=conteudo,
                    modelo_presetado=modelo_presetado
                )
                return Response({"message": "Histórico criado com sucesso!", "id": historico.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)  # Log do erro para depuração
            return Response({"error": "Erro ao salvar o histórico."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




