# Generated by Django 5.2 on 2025-05-28 14:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pacientes', '0003_alter_agendamento_motivo'),
    ]

    operations = [
        migrations.CreateModel(
            name='RegistroSessao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField(auto_now_add=True)),
                ('regioes_de_dor', models.JSONField()),
                ('observacoes', models.TextField(blank=True)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registros_sessao', to='pacientes.paciente')),
            ],
        ),
    ]
