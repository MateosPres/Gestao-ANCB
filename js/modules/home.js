import { collection, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from '../services/firebase.js';

// Função para formatar a data
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

// Função para renderizar um card de evento
function renderEventCard(evento) {
    const badgeClass = evento.modalidade === '3x3' ? 'badge-3x3' : 'badge-5x5';
    // O atributo data-target agora é usado para a navegação
    return `
        <div class="ongoing-event-card card" data-id="${evento.id}" data-target="evento-${evento.id}">
            <span class="championship-type-badge ${badgeClass}">${evento.modalidade}</span>
            <h3 class="championship-name">${evento.nome}</h3>
            <div class="championship-info">
                <p>📅 <strong>Data:</strong> ${formatDate(evento.data)}</p>
                <p><strong>Tipo:</strong> ${evento.type.replace('_', ' ')}</p>
            </div>
        </div>`;
}

// Função que busca e renderiza os eventos em andamento
function renderOngoingEvents() {
    const grid = document.getElementById('grid-eventos-andamento-home');
    if (!grid) return; // Se a grid não estiver na página, não faz nada

    const q = query(collection(db, "eventos"), where("status", "==", "andamento"), orderBy("data", "desc"));
    
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            grid.innerHTML = '<p>Nenhum evento em andamento no momento.</p>';
            return;
        }
        grid.innerHTML = '';
        snapshot.forEach(doc => {
            const evento = { id: doc.id, ...doc.data() };
            grid.innerHTML += renderEventCard(evento);
        });
    }, (error) => {
        console.error("Erro ao buscar eventos em andamento: ", error);
        grid.innerHTML = '<p>Não foi possível carregar os eventos.</p>';
    });
}

// Função de inicialização do módulo
export function initHome() {
    // Ouve o evento de navegação para saber quando a página 'home' foi carregada
    document.body.addEventListener('page-loaded', (e) => {
        if (e.detail.page === 'home') {
            renderOngoingEvents();
        }
    });
}

