/**
 * Adiciona um novo container de mobilidade ao container principal.
 * @param {HTMLElement} mobilidadesContainer - O elemento onde os containers de mobilidade serão adicionados.
 */
export function adicionarMobilidade(mobilidadesContainer) {
    // Criar um novo container para mobilidade
    const mobilidadeItem = document.createElement("div");
    mobilidadeItem.classList.add("dynamic-item");

    mobilidadeItem.innerHTML = `
        <div class="mb-2">
            <label for="nome" class="form-label">Movimento</label>
            <input type="text" class="form-control nome-mobilidade" placeholder="Ex: Flexão de Joelho">
        </div>
        <div class="d-flex justify-content-between mb-2">
            <div class="me-2" style="flex: 1;">
                <label for="ladoEsquerdo" class="form-label">Esquerdo</label>
                <input type="text" class="form-control lado-esquerdo" placeholder="Ex: 90°">
            </div>
            <div style="flex: 1;">
                <label for="ladoDireito" class="form-label">Direito</label>
                <input type="text" class="form-control lado-direito" placeholder="Ex: 85°">
            </div>
        </div>
        <div class="mb-2">
            <label for="observacao" class="form-label">Observações</label>
            <textarea class="form-control observacao-mobilidade" rows="2" placeholder="Ex: Dor ao movimento"></textarea>
        </div>
        <button type="button" class="btn btn-danger btn-remove-item">Remover</button>
    `;

    // Adicionar funcionalidade para remover o item
    mobilidadeItem.querySelector(".btn-remove-item").addEventListener("click", function () {
        mobilidadeItem.remove();
    });

    // Adicionar o novo item ao container
    mobilidadesContainer.appendChild(mobilidadeItem);
}