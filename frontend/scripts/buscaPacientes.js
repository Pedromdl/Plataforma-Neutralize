import { API_BASE_URL } from '../config.js';

export async function buscarPacientes(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/buscar-pacientes/?search=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar pacientes");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        throw error;
    }
}