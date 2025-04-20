// forcaMuscularChart.js
export class ForcaMuscularChart {
    constructor(canvasId, noDataMessageId, filterContainerId) {
        this.canvas = document.getElementById(canvasId);
        this.noDataMessage = document.getElementById(noDataMessageId);
        this.filterContainer = document.getElementById(filterContainerId);
        this.chart = null;
    }

    render(pacienteData, filterDate = null) {
        console.log("Dados recebidos para renderização no ForcaMuscularChart:", pacienteData);

        if (!pacienteData || !pacienteData.dadosdeforcamuscular || pacienteData.dadosdeforcamuscular.length === 0) {
            this._hideChart();
            return;
        }

        let forcasMusculares = this._processData(pacienteData.dadosdeforcamuscular, filterDate);

        if (forcasMusculares.length === 0) {
            this._hideChart();
            return;
        }

        this._showChart();
        this._renderChart(forcasMusculares, filterDate);
    }

    _processData(forcasMusculares, filterDate) {
        forcasMusculares = forcasMusculares.map(fm => ({
            ...fm,
            dataObj: new Date(fm.data_avaliacao)
        }));

        forcasMusculares.sort((a, b) => b.dataObj - a.dataObj);

        if (filterDate) {
            forcasMusculares = forcasMusculares.filter(fm => {
                return fm.dataObj.toDateString() === new Date(filterDate).toDateString();
            });
        }

        const musculaturasUnicas = new Map();
        for (const fm of forcasMusculares) {
            if (!musculaturasUnicas.has(fm.musculatura)) {
                musculaturasUnicas.set(fm.musculatura, fm);
            }
        }

        return Array.from(musculaturasUnicas.values());
    }

    _hideChart() {
        this.canvas.style.display = 'none';
        this.noDataMessage.style.display = 'block';
        this.filterContainer.style.display = 'none';

        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    _showChart() {
        this.noDataMessage.style.display = 'none';
        this.canvas.style.display = 'block';
        this.filterContainer.style.display = 'block';
    }

    _renderChart(forcasMusculares, filterDate) {
        if (this.chart) {
            this.chart.destroy();
        }

        const nomesMusculatura = forcasMusculares.map(fm => fm.musculatura);
        const ladoEsquerdo = forcasMusculares.map(fm => parseInt(fm.lado_esquerdo));
        const ladoDireito = forcasMusculares.map(fm => parseInt(fm.lado_direito));
        const assimetria = this._calculateAssimetry(ladoEsquerdo, ladoDireito);

        const ctx = this.canvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nomesMusculatura,
                datasets: [
                    {
                        label: 'Lado Esquerdo',
                        data: ladoEsquerdo,
                        backgroundColor: '#B7DE42',
                        borderColor: '#B7DE42',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Lado Direito',
                        data: ladoDireito,
                        backgroundColor: '#0A0A0A',
                        borderColor: '#0A0A0A',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Assimetria (%)',
                        data: assimetria,
                        type: 'line',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        fill: false,
                        yAxisID: 'y-assimetria',
                        order: 0 // Garante que o gráfico de linha fique na frente
                    }
                ]
            },
            options: this._getChartOptions(forcasMusculares, ladoEsquerdo, ladoDireito, filterDate)
        });
    }

    _calculateAssimetry(ladoEsquerdo, ladoDireito) {
        return ladoEsquerdo.map((esq, i) => {
            const dir = ladoDireito[i];
            if (esq + dir === 0) return 0; // Evitar divisão por zero
            return Math.abs(esq - dir) / ((esq + dir) / 2) * 100;
        });
    }

    _getChartOptions(forcasMusculares, ladoEsquerdo, ladoDireito, filterDate) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nível de Força',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    suggestedMax: Math.max(...ladoEsquerdo, ...ladoDireito) + 10
                },
                'y-assimetria': {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Assimetria (%)',
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        drawOnChartArea: false // Não desenhar linhas de grade para o eixo de assimetria
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: filterDate
                        ? `Força Muscular - Avaliação em ${new Date(filterDate).toLocaleDateString('pt-BR')}`
                        : 'Força Muscular',
                    font: { size: 16 },
                    color: 'white'
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        };
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
