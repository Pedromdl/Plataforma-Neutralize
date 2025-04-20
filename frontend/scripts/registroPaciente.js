document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuração inicial - definir data atual como padrão
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataAvaliacaoGeral').value = today;
    let dataAvaliacaoGeral = today;

    // 2. Atualizar a data geral quando alterada
    document.getElementById('dataAvaliacaoGeral').addEventListener('change', function() {
        dataAvaliacaoGeral = this.value;
    });

    // 3. Templates sem campos de data individuais
    const templates = {
        mobilidade: `
            <div class="dynamic-item">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nome do Movimento*</label>
                        <input type="text" class="form-control mobilidade-nome" required>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Lado Direito</label>
                        <input type="text" class="form-control mobilidade-direito">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Lado Esquerdo</label>
                        <input type="text" class="form-control mobilidade-esquerdo">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Observações</label>
                    <textarea class="form-control mobilidade-observacao" rows="2"></textarea>
                </div>
            </div>
        `,
        forca: `
            <div class="dynamic-item">
                <div class="row">
                    <div class="col-md-5 mb-3">
                        <label class="form-label">Musculatura*</label>
                        <input type="text" class="form-control forca-musculatura" required>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Lado Direito</label>
                        <input type="text" class="form-control forca-direito">
                    </div>
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Lado Esquerdo</label>
                        <input type="text" class="form-control forca-esquerdo">
                    </div>
                    <div class="col-md-1 mb-3 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm btn-remove-item">X</button>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Observações</label>
                    <textarea class="form-control forca-observacao" rows="2"></textarea>
                </div>
            </div>
        `,
        escala: `
            <div class="dynamic-item">
                <div class="row">
                    <div class="col-md-5 mb-3">
                        <label class="form-label">Nome da Escala*</label>
                        <input type="text" class="form-control escala-nome" required>
                    </div>
                    <div class="col-md-5 mb-3">
                        <label class="form-label">Resultado*</label>
                        <input type="text" class="form-control escala-resultado" required>
                    </div>
                    <div class="col-md-2 mb-3 d-flex align-items-end">
                        <button type="button" class="btn btn-danger btn-sm btn-remove-item">X</button>
                    </div>
                </div>
            </div>
        `
    };

    // 4. Adicionar itens dinâmicos
    document.getElementById('btnAdicionarMobilidade').addEventListener('click', () => {
        document.getElementById('mobilidadesContainer').insertAdjacentHTML('beforeend', templates.mobilidade);
    });

    document.getElementById('btnAdicionarForca').addEventListener('click', () => {
        document.getElementById('forcaMuscularContainer').insertAdjacentHTML('beforeend', templates.forca);
    });

    document.getElementById('btnAdicionarEscala').addEventListener('click', () => {
        document.getElementById('escalasContainer').insertAdjacentHTML('beforeend', templates.escala);
    });

    // 5. Remover itens dinâmicos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove-item')) {
            e.target.closest('.dynamic-item').remove();
        }
    });

    // 6. Cancelar cadastro
    document.getElementById('btnCancelar').addEventListener('click', function() {
        if (confirm('Deseja realmente cancelar o cadastro? Todos os dados não salvos serão perdidos.')) {
            window.location.href = 'index.html';
        }
    });

    // 7. Enviar formulário
    document.getElementById('cadastroPacienteForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = e.target.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cadastrando...';
        btnSubmit.disabled = true;

        try {
            // Validar data de avaliação
            if (!dataAvaliacaoGeral) {
                throw new Error('Por favor, informe a data da avaliação');
            }

            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                idade: document.getElementById('idade').value,
                cpf: document.getElementById('cpf').value,
                diagnostico: document.getElementById('diagnostico').value,
                data_avaliacao: dataAvaliacaoGeral,
                mobilidades: [],
                dadosdeforcamuscular: [],
                escalasequestionarios: []
            };

            // Processar mobilidades
            document.querySelectorAll('#mobilidadesContainer .dynamic-item').forEach(item => {
                formData.mobilidades.push({
                    nome: item.querySelector('.mobilidade-nome').value,
                    lado_direito: item.querySelector('.mobilidade-direito').value,
                    lado_esquerdo: item.querySelector('.mobilidade-esquerdo').value,
                    data_avaliacao: dataAvaliacaoGeral,
                    observacao: item.querySelector('.mobilidade-observacao').value
                });
            });

            // Processar força muscular
            document.querySelectorAll('#forcaMuscularContainer .dynamic-item').forEach(item => {
                formData.dadosdeforcamuscular.push({
                    musculatura: item.querySelector('.forca-musculatura').value,
                    lado_direito: item.querySelector('.forca-direito').value,
                    lado_esquerdo: item.querySelector('.forca-esquerdo').value,
                    data_avaliacao: dataAvaliacaoGeral,
                    observacao: item.querySelector('.forca-observacao').value
                });
            });

            // Processar escalas e questionários
            document.querySelectorAll('#escalasContainer .dynamic-item').forEach(item => {
                formData.escalasequestionarios.push({
                    nome: item.querySelector('.escala-nome').value,
                    resultado: item.querySelector('.escala-resultado').value,
                    data_avaliacao: dataAvaliacaoGeral
                });
            });

            // Validar pelo menos um exame cadastrado
            if (formData.mobilidades.length === 0 && 
                formData.dadosdeforcamuscular.length === 0 && 
                formData.escalasequestionarios.length === 0) {
                throw new Error('Por favor, adicione pelo menos um exame (mobilidade, força muscular ou escala)');
            }

            // Enviar para a API
            const response = await fetch(`${API_BASE_URL}/salvar-paciente/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            alert('Paciente cadastrado com sucesso!');
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Erro:', error);
            alert(error.message || 'Erro ao cadastrar paciente');
        } finally {
            btnSubmit.innerHTML = btnOriginalText;
            btnSubmit.disabled = false;
        }
    });
});