document.addEventListener('DOMContentLoaded', function() {
    fetch('layout/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;

            const sidebar = document.querySelector(".sidebar");

            // Só cria o botão de desktop se não for mobile
            if (window.innerWidth > 768) {
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
            }

            // Menu mobile
            const btn = document.getElementById('mobileMenuBtn');
            const modal = document.getElementById('mobileMenuModal');
            const close = document.getElementById('closeMobileMenu');

            if (btn && modal && close) {
                btn.addEventListener('click', () => {
                    modal.style.display = 'block';
                });
                close.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.style.display = 'none';
                });
            }
        });
});