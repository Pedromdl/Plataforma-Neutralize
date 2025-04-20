// Registrar o Blot Personalizado para Divisores
const BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
    static create() {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');
        return node;
    }
}

DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

Quill.register(DividerBlot);

// Função para inicializar o Quill.js
export function initializeQuill(selector, options = {}) {
    const defaultOptions = {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'], // Estilos de texto
                [{ list: 'ordered' }, { list: 'bullet' }], // Listas
                ['link', 'image'], // Links e imagens
                ['clean'], // Limpar formatação
            ],
        },
        ...options, // Permite sobrescrever as opções padrão
    };

    return new Quill(selector, defaultOptions);
}