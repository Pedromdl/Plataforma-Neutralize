/**
 * Adiciona um novo container de escalas e questionários ao container principal.
 * @param {HTMLElement} escalasContainer - O elemento onde os containers de escalas serão adicionados.
 */
export function adicionarEscala(escalasContainer) {
    // Criar um novo container para escalas e questionários
    const escalaItem = document.createElement("div");
    escalaItem.classList.add("dynamic-item");

    escalaItem.innerHTML = `
        <div class="mb-2">
            <label for="nome" class="form-label">Nome da Escala</label>
            <input type="text" class="form-control nome-escala" placeholder="Ex: Escala de Dor">
        </div>
        <div class="mb-2">
            <label for="resultado" class="form-label">Resultado</label>
            <input type="text" class="form-control resultado-escala" placeholder="Ex: 7/10">
        </div>
        <button type="button" class="btn btn-danger btn-remove-item">Remover</button>
    `;

    // Adicionar funcionalidade para remover o item
    escalaItem.querySelector(".btn-remove-item").addEventListener("click", function () {
        escalaItem.remove();
    });

    // Adicionar o novo item ao container
    escalasContainer.appendChild(escalaItem);
}