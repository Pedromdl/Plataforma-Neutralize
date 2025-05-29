import { API_BASE_URL } from '../config.js';


export class SemanasAvaliacao {
    constructor(containerId, noDataMessageId, listId) {
        this.container = document.getElementById(containerId);
        this.noDataMessage = document.getElementById(noDataMessageId);
        this.list = document.getElementById(listId);
    }

    async fetchAndRender(pacienteId) {
        try {
            // Fazer a requisição para a API
            const response = await fetch(`${API_BASE_URL}/historicos-clinicos/${pacienteId}/`);
            if (!response.ok) {
                throw new Error("Erro ao buscar os dados do histórico clínico.");
            }

            const avaliacoes = await response.json();
            this.render(avaliacoes);
        } catch (error) {
            console.error(error);
            this._hideContainer();
        }
    }

    render(avaliacoes) {
        if (!avaliacoes || avaliacoes.length === 0) {
            this._hideContainer();
            return;
        }

        // Limpar a lista antes de renderizar
        this.list.innerHTML = '';

        // Adicionar cada avaliação à lista
        avaliacoes.forEach(avaliacao => {
            const semanas = this._calcularSemanas(avaliacao.data_avaliacao);

            // Criar o item da lista
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item text-center'; // Centraliza o texto

            // Criar o número de semanas em fonte maior
            const semanasTexto = document.createElement('div');
            semanasTexto.className = 'semanas-numero';
            semanasTexto.textContent = semanas;

            // Criar o texto "semanas atrás" em itálico
            const semanasDescricao = document.createElement('div');
            semanasDescricao.className = 'semanas-descricao';
            semanasDescricao.textContent = 'semanas após avaliação';

            // Adicionar os elementos ao item da lista
            listItem.appendChild(semanasTexto);
            listItem.appendChild(semanasDescricao);

            // Adicionar o item à lista
            this.list.appendChild(listItem);
        });

        this._showContainer();
    }

    _calcularSemanas(dataAvaliacao) {
        const dataAtual = new Date();
        const dataAvaliacaoDate = new Date(dataAvaliacao);
        const diferencaDias = Math.floor((dataAtual - dataAvaliacaoDate) / (1000 * 60 * 60 * 24));
        return Math.floor(diferencaDias / 7); // Converte dias para semanas
    }

    _showContainer() {
        this.container.style.display = 'block';
        if (this.noDataMessage) {
            this.noDataMessage.style.display = 'none';
        }
    }

    _hideContainer() {
        this.container.style.display = 'none';
        if (this.noDataMessage) {
            this.noDataMessage.style.display = 'block';
        }
    }
}