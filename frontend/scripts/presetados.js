/**
 * Função para buscar todos os modelos pré-setados do backend.
 * @returns {Promise<Array>} Retorna uma promessa com a lista de modelos.
 */

import { API_BASE_URL } from './config.js';

export async function buscarModelosPresetados() {
    try {
        const response = await fetch(`${API_BASE_URL}/modelos-presetados/`);
        if (!response.ok) {
            throw new Error("Erro ao buscar modelos pré-setados.");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar modelos pré-setados:", error);
        return [];
    }
}

/**
 * Função para buscar o conteúdo de um modelo pré-setado específico.
 * @param {number} modeloId ID do modelo pré-setado.
 * @returns {Promise<Object>} Retorna uma promessa com os dados do modelo.
 */
export async function buscarConteudoModelo(modeloId) {
    try {
        const response = await fetch(`${API_BASE_URL}/modelos-presetados/${modeloId}/`);
        if (!response.ok) {
            throw new Error("Erro ao buscar o conteúdo do modelo.");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao carregar conteúdo do modelo:", error);
        return null;
    }
}

/**
 * Busca os modelos pré-setados do backend e insere no seletor.
 * @param {HTMLElement} modeloPresetadoSelect - O elemento <select> onde os modelos serão inseridos.
 * @param {Function} onModeloSelecionado - Callback para lidar com a seleção de um modelo.
 */
export async function carregarModelosPresetados(modeloPresetadoSelect, onModeloSelecionado) {
    try {
        const response = await fetch(`${API_BASE_URL}/modelos-presetados/`);
        if (!response.ok) {
            throw new Error('Erro ao buscar modelos pré-setados.');
        }

        const modelos = await response.json();
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo.id;
            option.textContent = modelo.nome;
            modeloPresetadoSelect.appendChild(option);
        });

        // Adicionar evento de mudança para o seletor
        modeloPresetadoSelect.addEventListener('change', function () {
            const modeloId = this.value;
            if (modeloId) {
                onModeloSelecionado(modeloId);
            } else {
                onModeloSelecionado(null);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar modelos pré-setados:', error);
    }
}

/**
 * Busca o conteúdo de um modelo pré-setado pelo ID.
 * @param {string} modeloId - O ID do modelo a ser buscado.
 * @returns {Promise<Object>} - O modelo retornado pelo backend.
 */
export async function buscarModeloPorId(modeloId) {
    try {
        const response = await fetch(`${API_BASE_URL}/modelos-presetados/${modeloId}/`);
        if (!response.ok) {
            throw new Error('Erro ao buscar o modelo pré-setado.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar o modelo pré-setado:', error);
        throw error;
    }
}