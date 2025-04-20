/**
 * Adiciona um novo container de força muscular ao container principal.
 * @param {HTMLElement} forcaMuscularContainer - O elemento onde os containers de força muscular serão adicionados.
 */
export function adicionarForcaMuscular(forcaMuscularContainer) {
    // Criar um novo container para força muscular
    const forcaItem = document.createElement("div");
    forcaItem.classList.add("dynamic-item");

    forcaItem.innerHTML = `
        <div class="mb-2">
            <label for="musculatura" class="form-label">Musculatura</label>
            <input type="text" class="form-control musculatura" placeholder="Ex: Bíceps">
        </div>
        <div class="d-flex justify-content-between mb-2">
            <div class="me-2" style="flex: 1;">
                <label for="ladoEsquerdo" class="form-label">Esquerdo</label>
                <input type="text" class="form-control lado-esquerdo" placeholder="Ex: 4/5">
            </div>
            <div style="flex: 1;">
                <label for="ladoDireito" class="form-label">Direito</label>
                <input type="text" class="form-control lado-direito" placeholder="Ex: 5/5">
            </div>
        </div>
        <div class="mb-2">
            <label for="observacao" class="form-label">Observações</label>
            <textarea class="form-control observacao-forca" rows="2" placeholder="Ex: Dor ao movimento"></textarea>
        </div>
        <button type="button" class="btn btn-danger btn-remove-item">Remover</button>
    `;

    // Adicionar funcionalidade para remover o item
    forcaItem.querySelector(".btn-remove-item").addEventListener("click", function () {
        forcaItem.remove();
    });

    // Adicionar o novo item ao container
    forcaMuscularContainer.appendChild(forcaItem);
}