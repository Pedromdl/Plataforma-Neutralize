from django.db import models
from datetime import date

# Create your models here.

class Paciente(models.Model):
    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField(verbose_name="Data de Nascimento", blank=True, null=True)  # Permitir nulo
    cpf = models.CharField(max_length=14, unique=True, blank=True, null=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

    @property
    def idade(self):
        """Calcula a idade com base na data de nascimento."""
        if self.data_nascimento:
            today = date.today()
            return today.year - self.data_nascimento.year - (
                (today.month, today.day) < (self.data_nascimento.month, self.data_nascimento.day)
            )
        return None
    
class Mobilidade(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='mobilidades')
    nome = models.CharField(max_length=100, verbose_name="Mobilidade")  # Campo obrigatório
    data_avaliacao = models.DateField(verbose_name="Data")
    lado_esquerdo = models.CharField(max_length=100, verbose_name="Lado Esquerdo")
    lado_direito = models.CharField(max_length=100, verbose_name="Lado Direito")
    observacao = models.TextField(blank=True, verbose_name="Observações")

    class Meta:
        ordering = ['-data_avaliacao']

    def __str__(self):
        return f"{self.nome} - {self.data_avaliacao}"
    
class ForcaMuscular(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='dadosdeforcamuscular')
    musculatura = models.CharField(max_length=100, verbose_name="Musculatura")
    data_avaliacao = models.DateField(verbose_name="Data")
    lado_esquerdo = models.CharField(max_length=100, verbose_name="Lado Esquerdo")
    lado_direito = models.CharField(max_length=100, verbose_name="Lado Direito")
    observacao = models.TextField(blank=True, verbose_name="Observações")

    class Meta:
            verbose_name = "Força Muscular"
            verbose_name_plural = "Forças Musculares"
            ordering = ['-data_avaliacao']
            
    def __str__(self):
        return f"{self.paciente} - {self.data_avaliacao} - {self.musculatura}"
    
    
class EscalaseQuestionários(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='escalasequestionarios')
    nome   = models.CharField(max_length=100, verbose_name="Nome")
    data_avaliacao = models.DateField(verbose_name="Data")
    resultado = models.CharField(max_length=100, verbose_name="Resultado")

    class Meta:
        verbose_name = "Escala e Questionário"
        verbose_name_plural = "Escalas e Questionários"
        ordering = ['-data_avaliacao']

    def __str__(self):
        return f"{self.paciente} - {self.data_avaliacao} - {self.nome}"
    
class CategoriaTeste(models.Model):
    """Tabela que contém todos os testes disponíveis"""
    nome = models.CharField(max_length=100, unique=True)

    class Meta:
            verbose_name = "Categoria de Teste"

    def __str__(self):  
        return self.nome
    
class TodosTestes(models.Model):
    """Tabela que contém todos os testes disponíveis"""
    nome = models.CharField(max_length=100, unique=True)
    categoria = models.ForeignKey(CategoriaTeste, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
            verbose_name = "Todos os Teste"

    def __str__(self):
        return f"{self.nome} ({self.categoria.nome if self.categoria else 'Sem categoria'})"
    
class TesteFuncao(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='dadosdetestes')
    teste = models.ForeignKey(TodosTestes, on_delete=models.CASCADE)  # Agora os testes são pré-definidos
    data_avaliacao = models.DateField(verbose_name="Data")
    lado_esquerdo = models.CharField(max_length=100, verbose_name="Lado Esquerdo")
    lado_direito = models.CharField(max_length=100, verbose_name="Lado Direito")
    observacao = models.TextField(blank=True, verbose_name="Observações")

    class Meta:
        verbose_name = "Teste de Função"
        verbose_name_plural = "Testes de Função"
        ordering = ['-data_avaliacao']

    def __str__(self):
        return f"{self.paciente} - {self.data_avaliacao} - {self.teste}"

class ModeloPresetado(models.Model):
    """Modelos pré-setados para informações clínicas"""
    nome = models.CharField(max_length=100, unique=True, verbose_name="Nome do Modelo")
    conteudo = models.TextField(verbose_name="Conteúdo do Modelo")

    class Meta:
        verbose_name = "Modelo Pré-Setado"
        verbose_name_plural = "Modelos Pré-Setados"

    def __str__(self):
        return self.nome

class HistoricoClinico(models.Model):
    """Histórico clínico dos pacientes"""
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='historicos_clinicos')
    data_avaliacao = models.DateField(verbose_name="Data da Avaliação", default=date.today)  # Permite edição
    conteudo = models.TextField(verbose_name="Conteúdo", blank=True, null=True)
    modelo_presetado = models.ForeignKey(ModeloPresetado, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Modelo Pré-Setado")

    class Meta:
        verbose_name = "Histórico Clínico"
        verbose_name_plural = "Históricos Clínicos"
        ordering = ['-data_avaliacao']
        
    def __str__(self):
        return f"Histórico de {self.paciente} - {self.data_avaliacao}"

class Agendamento(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='agendamentos')
    data_hora = models.DateTimeField(verbose_name="Data e Hora do Agendamento")
    motivo = models.CharField(max_length=255, null=True, blank= True, verbose_name="Motivo da Consulta")
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pendente', 'Pendente'),
            ('Confirmado', 'Confirmado'),
            ('Cancelado', 'Cancelado'),
        ],
        default='Pendente',
        verbose_name="Status do Agendamento"
    )
    observacoes = models.TextField(blank=True, null=True, verbose_name="Observações")

    class Meta:
        ordering = ['-data_hora']
        verbose_name = "Agendamento"
        verbose_name_plural = "Agendamentos"

    def __str__(self):
        return f"{self.paciente} - {self.data_hora} - {self.status}"
    
class RegistroSessao(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='registros_sessao')
    data = models.DateField(verbose_name="Data da Sessão", default=date.today)  # Permite edição!
    observacoes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Registro de Sessão"
        verbose_name_plural = "Registro de Sessões"
        ordering = ['-data']

    def __str__(self):
        return f"{self.paciente} - {self.data}"

class RegiaoDor(models.Model):
    registro = models.ForeignKey(RegistroSessao, on_delete=models.CASCADE, related_name='regioes')
    regiao = models.CharField(max_length=50)  # Ex: "ombro_direito", "lombar"
    valor = models.PositiveSmallIntegerField()  # Ex: 0 a 10

    class Meta:
        verbose_name = "Região de Dor"
        verbose_name_plural = "Regiões de Dor"
        ordering = ['registro', 'regiao']

    def __str__(self):
        return f"{self.regiao}: {self.valor} ({self.registro})"