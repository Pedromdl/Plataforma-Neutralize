export class TesteFuncaoChart {
  constructor(canvasId, noDataMessageId, filterContainerId) {
      this.canvas = document.getElementById(canvasId);
      this.noDataMessage = document.getElementById(noDataMessageId);
      this.filterContainer = document.getElementById(filterContainerId);
      this.chart = null;
  }

  render(pacienteData, filterDate = null) {
      if (!pacienteData || !pacienteData.dadosdetestes || pacienteData.dadosdetestes.length === 0) {
          this._hideChart();
          return;
      }

      let testesFuncao = this._processData(pacienteData.dadosdetestes, filterDate);

      if (testesFuncao.length === 0) {
          this._hideChart();
          return;
      }

      this._showChart();
      this._renderChart(testesFuncao, filterDate);
  }

  _processData(testesFuncao, filterDate) {
      testesFuncao = testesFuncao.map(tf => ({
          ...tf,
          dataObj: new Date(tf.data_avaliacao)
      }));

      // Ordenar por data (mais recente primeiro)
      testesFuncao.sort((a, b) => b.dataObj - a.dataObj);

      // Filtrar por data se necessário
      if (filterDate) {
          testesFuncao = testesFuncao.filter(tf => {
              return tf.dataObj.toDateString() === new Date(filterDate).toDateString();
          });
      }

      // Manter apenas o teste mais recente de cada tipo
      const testesUnicos = new Map();
      for (const tf of testesFuncao) {
          if (!testesUnicos.has(tf.teste.nome)) {
              testesUnicos.set(tf.teste.nome, tf);
          }
      }

      return Array.from(testesUnicos.values());
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

  _renderChart(testesFuncao, filterDate) {
      if (this.chart) {
          this.chart.destroy();
      }

      const nomesTestes = testesFuncao.map(tf => tf.teste.nome);
      const ladoEsquerdo = testesFuncao.map(tf => parseInt(tf.lado_esquerdo));
      const ladoDireito = testesFuncao.map(tf => parseInt(tf.lado_direito));
      const assimetria = this._calculateAssimetry(ladoEsquerdo, ladoDireito);

      const ctx = this.canvas.getContext('2d');
      this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: nomesTestes,
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
                      yAxisID: 'y-assimetria'
                  }
              ]
          },
          options: this._getChartOptions(testesFuncao, ladoEsquerdo, ladoDireito, filterDate)
      });
  }

  _calculateAssimetry(ladoEsquerdo, ladoDireito) {
      return ladoEsquerdo.map((esq, i) => {
          const dir = ladoDireito[i];
          if (esq + dir === 0) return 0; // Evitar divisão por zero
          return Math.abs(esq - dir) / ((esq + dir) / 2) * 100;
      });
  }

  destroy() {
      if (this.chart) {
          this.chart.destroy();
          this.chart = null;
      }
  }
}