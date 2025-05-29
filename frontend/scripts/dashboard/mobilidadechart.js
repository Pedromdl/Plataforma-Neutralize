// mobilidadeChart.js
export class MobilidadeChart {
    constructor(canvasId, noDataMessageId, filterContainerId) {
      this.canvas = document.getElementById(canvasId);
      this.noDataMessage = document.getElementById(noDataMessageId);
      this.filterContainer = document.getElementById(filterContainerId);
      this.chart = null;
    }
  
    render(pacienteData, filterDate = null) {

      console.log("Dados recebidos para renderização no MobilidadeChart:", pacienteData);

      if (!pacienteData || !pacienteData.mobilidades || pacienteData.mobilidades.length === 0) {
        this._hideChart();
        return;
      }
  
      let mobilidades = this._processData(pacienteData.mobilidades, filterDate);
      
      if (mobilidades.length === 0) {
        this._hideChart();
        return;
      }
  
      this._showChart();
      this._renderChart(mobilidades, filterDate);
    }
  
    _processData(mobilidades, filterDate) {
        mobilidades = mobilidades.map(mob => ({
            ...mob,
            dataObj: new Date(mob.data_avaliacao)
        }));

        mobilidades.sort((a, b) => b.dataObj - a.dataObj);

        if (filterDate) {
            mobilidades = mobilidades.filter(mob => {
                return mob.dataObj.toDateString() === new Date(filterDate).toDateString();
            });
        }

        const mobilidadesUnicas = new Map();
        for (const mob of mobilidades) {
            if (!mobilidadesUnicas.has(mob.nome)) {
                mobilidadesUnicas.set(mob.nome, mob);
            }
        }

        const result = Array.from(mobilidadesUnicas.values());
        console.log("Dados processados para renderização:", result);
        return result;
    }
  
    _hideChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        if (this.container) {
            this.container.style.display = 'none';
        } else {
            console.warn("Elemento do gráfico não encontrado.");
        }
    }
  
    _showChart() {
        console.log("Chamando _showChart");
        if (this.noDataMessage) {
            this.noDataMessage.style.display = 'none';
        }
        if (this.canvas) {
            this.canvas.style.display = 'block';
        }
        if (this.filterContainer) {
            this.filterContainer.style.display = 'block';
        }
    }
  
    _renderChart(mobilidades, filterDate) {
        console.log("Dados para o gráfico:", mobilidades);

        if (this.chart) {
            this.chart.destroy();
        }

        const nomesMobilidade = mobilidades.map(mob => mob.nome);
        const ladoEsquerdo = mobilidades.map(mob => parseInt(mob.lado_esquerdo));
        const ladoDireito = mobilidades.map(mob => parseInt(mob.lado_direito));

        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nomesMobilidade,
                datasets: [
                    {
                        label: 'Lado Esquerdo',
                        data: ladoEsquerdo,
                        backgroundColor: '#B7DE42',
                        borderColor: '#B7DE42',
                        borderWidth: 1
                    },
                    {
                        label: 'Lado Direito',
                        data: ladoDireito,
                        backgroundColor: '#0A0A0A',
                        borderColor: '#0A0A0A',
                        borderWidth: 1
                    }
                ]
            },
            options: this._getChartOptions(mobilidades, filterDate)
        });
    }
  
    _getChartOptions(mobilidades, filterDate) {
        const ladoEsquerdo = mobilidades.map(mob => parseInt(mob.lado_esquerdo));
        const ladoDireito = mobilidades.map(mob => parseInt(mob.lado_direito));

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: { 
                        display: true,
                        text: 'Graus de Movimento',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    suggestedMax: Math.max(...ladoEsquerdo, ...ladoDireito) + 10
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: filterDate 
                        ? `Mobilidade Articular - Avaliação em ${new Date(filterDate).toLocaleDateString('pt-BR')}` 
                        : 'Mobilidade Articular',
                    font: { size: 12 },
                    color: 'white'
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        };

        console.log("Opções do gráfico:", options);
        return options;
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
