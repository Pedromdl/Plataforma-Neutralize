document.addEventListener("DOMContentLoaded", function () {
    // Carregar gráficos ao carregar a página
    fetchDadosPaciente().then(dados => {
        renderizarGraficoMobilidade(dados);
        renderizarGraficoForcaMuscular(dados);
    });
});