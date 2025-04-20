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


    def __str__(self):
        return f"{self.paciente} - {self.data_avaliacao} - {self.musculatura}"
    
    
class EscalaseQuestionários(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='escalasequestionarios')
    nome   = models.CharField(max_length=100, verbose_name="Nome")
    data_avaliacao = models.DateField(verbose_name="Data")
    resultado = models.CharField(max_length=100, verbose_name="Resultado")

    def __str__(self):
        return f"{self.paciente} - {self.data_avaliacao} - {self.nome}"
    
class CategoriaTeste(models.Model):
    """Tabela que contém todos os testes disponíveis"""
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):  
        return self.nome
    
class TodosTestes(models.Model):
    """Tabela que contém todos os testes disponíveis"""
    nome = models.CharField(max_length=100, unique=True)
    categoria = models.ForeignKey(CategoriaTeste, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.nome} ({self.categoria.nome if self.categoria else 'Sem categoria'})"
    
class TesteFuncao(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='dadosdetestes')
    teste = models.ForeignKey(TodosTestes, on_delete=models.CASCADE)  # Agora os testes são pré-definidos
    data_avaliacao = models.DateField(verbose_name="Data")
    lado_esquerdo = models.CharField(max_length=100, verbose_name="Lado Esquerdo")
    lado_direito = models.CharField(max_length=100, verbose_name="Lado Direito")
    observacao = models.TextField(blank=True, verbose_name="Observações")

    def __str__(self):
        return f"{self.paciente} - {self.data_avaliacao} - {self.teste}"

class ModeloPresetado(models.Model):
    """Modelos pré-setados para informações clínicas"""
    nome = models.CharField(max_length=100, unique=True, verbose_name="Nome do Modelo")
    conteudo = models.TextField(verbose_name="Conteúdo do Modelo")

    def __str__(self):
        return self.nome

class HistoricoClinico(models.Model):
    """Histórico clínico dos pacientes"""
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='historicos_clinicos')
    data_avaliacao = models.DateField(verbose_name="Data da Avaliação", auto_now_add=True)
    conteudo = models.TextField(verbose_name="Conteúdo", blank=True, null=True)
    modelo_presetado = models.ForeignKey(ModeloPresetado, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Modelo Pré-Setado")

    def __str__(self):
        return f"Histórico de {self.paciente} - {self.data_avaliacao}"