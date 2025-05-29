document.addEventListener('DOMContentLoaded', function() {
    fetch('layout/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;

            // Agora o sidebar existe, então crie o botão e o evento
            const sidebar = document.getElementById("sidebar");
            const toggleButton = document.createElement("button");
            toggleButton.id = "toggleSidebar";
            toggleButton.className = "btn btn-primary btn-sm m-2";
            toggleButton.textContent = "☰ Menu";
            toggleButton.style.position = "fixed";
            toggleButton.style.top = "10px";
            toggleButton.style.left = "10px";
            toggleButton.style.zIndex = "1100";
            document.body.appendChild(toggleButton);

            toggleButton.addEventListener("click", function() {
                sidebar.classList.toggle("hidden");
            });
        });
});