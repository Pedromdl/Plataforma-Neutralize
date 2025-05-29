export class EvolucaoMobilidadeChart {
    constructor(canvasId, noDataMessageId) {
        this.canvas = document.getElementById(canvasId);
        this.noDataMessage = document.getElementById(noDataMessageId);
        this.chart = null;
    }

    render(mobilidades) {
        if (!mobilidades || mobilidades.length === 0) {
            this._hideChart();
            return;
        }

        // Processar os dados para o gráfico
        const datasAvaliacao = mobilidades.map(mob => new Date(mob.data_avaliacao).toLocaleDateString('pt-BR'));
        const valoresMobilidade = mobilidades.map(mob => parseInt(mob.valor)); // Supondo que o campo "valor" exista

        if (valoresMobilidade.length === 0) {
            this._hideChart();
            return;
        }

        this._showChart();
        this._renderChart(datasAvaliacao, valoresMobilidade);
    }

    _renderChart(labels, data) {
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line', // Gráfico de linha para evolução
            data: {
                labels: labels, // Datas no eixo X
                datasets: [
                    {
                        label: 'Mobilidade',
                        data: data,
                        borderColor: '#4A90E2',
                        backgroundColor: 'rgba(74, 144, 226, 0.2)',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: this._getChartOptions()
        });
    }

    _getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Data de Avaliação',
                        color: 'black'
                    },
                    ticks: {
                        color: 'black'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valores de Mobilidade',
                        color: 'black'
                    },
                    ticks: {
                        color: 'black'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução da Mobilidade',
                    font: { size: 16 },
                    color: 'black'
                },
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        };
    }

    _showChart() {
        this.canvas.style.display = 'block';
        if (this.noDataMessage) {
            this.noDataMessage.style.display = 'none';
        }
    }

    _hideChart() {
        this.canvas.style.display = 'none';
        if (this.noDataMessage) {
            this.noDataMessage.style.display = 'block';
        }
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy(); // Destroi o gráfico do Chart.js
            this.chart = null; // Limpa a referência ao gráfico
        }
    }
}