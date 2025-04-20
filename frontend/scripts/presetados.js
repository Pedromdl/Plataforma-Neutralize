/**
 * Função para buscar todos os modelos pré-setados do backend.
 * @returns {Promise<Array>} Retorna uma promessa com a lista de modelos.
 */

import { API_BASE_URL } from '../config.js';

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