import { API_BASE_URL } from '../../config.js';

document.addEventListener('DOMContentLoaded', function () {
            const calendarEl = document.getElementById('calendar');

            const calendar = new FullCalendar.Calendar(calendarEl, {
                locale: 'pt-br',
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                selectable: true,
                select: async function (info) {
                    const modal = document.getElementById('eventModal');
                    await carregarPacientesSelect();

                    // Limpa os campos do formulário
                    document.getElementById('eventForm').reset();
                    document.getElementById('dataHora').value = info.startStr.slice(0, 16);
                    document.getElementById('status').value = 'Pendente';

                    // Mostra o modal
                    modal.style.display = 'flex';

                    // Remove listeners antigos para evitar múltiplos envios
                    const saveBtn = document.getElementById('saveEvent');
                    const newSaveBtn = saveBtn.cloneNode(true);
                    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

                    newSaveBtn.onclick = async function () {
                        try {
                            const repetir = document.getElementById('repetir').value;
                            const repetirAte = document.getElementById('repetirAte').value;

                            const novoEvento = {
                                paciente: document.getElementById('paciente').value,
                                data_hora: document.getElementById('dataHora').value,
                                motivo: document.getElementById('motivo').value,
                                status: document.getElementById('status').value,
                                observacoes: document.getElementById('observacoes').value,
                            };

                            if (repetir !== 'nao' && repetirAte) {
                                let dataAtual = new Date(novoEvento.data_hora);
                                const dataFinal = new Date(repetirAte + 'T23:59');
                                let incrementoDias = 0;
                                if (repetir === 'semanal') incrementoDias = 7;
                                if (repetir === 'quinzenal') incrementoDias = 14;

                                while (dataAtual <= dataFinal) {
                                    // Formata a data para 'YYYY-MM-DDTHH:mm'
                                    const ano = dataAtual.getFullYear();
                                    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                                    const dia = String(dataAtual.getDate()).padStart(2, '0');
                                    const horas = String(dataAtual.getHours()).padStart(2, '0');
                                    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
                                    const dataFormatada = `${ano}-${mes}-${dia}T${horas}:${minutos}`;

                                    let eventoRecorrente = { ...novoEvento, data_hora: dataFormatada };
                                    const response = await fetch(`${API_BASE_URL}/agendamentos/`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(eventoRecorrente),
                                    });

                                    if (!response.ok) {
                                        const erro = await response.text();
                                        alert('Erro ao criar evento recorrente: ' + erro);
                                        break;
                                    }

                                    if (repetir === 'mensal') {
                                        dataAtual.setMonth(dataAtual.getMonth() + 1);
                                    } else {
                                        dataAtual.setDate(dataAtual.getDate() + incrementoDias);
                                    }
                                }
                            } else {
                                // Evento único
                                const response = await fetch(`${API_BASE_URL}/agendamentos/`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(novoEvento),
                                });
                                if (!response.ok) throw new Error('Erro ao criar agendamento');
                            }

                            alert('Agendamento(s) criado(s) com sucesso!');
                            modal.style.display = 'none';
                            calendar.refetchEvents();
                        } catch (error) {
                            console.error('Erro ao criar agendamento:', error);
                            alert('Erro ao criar agendamento.');
                        }
                    };
                },
                events: async function (fetchInfo, successCallback, failureCallback) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/agendamentos/`);
                        const agendamentos = await response.json();
                        const eventos = agendamentos.map(agendamento => ({
                            id: agendamento.id, // <-- ESSENCIAL!
                            title: agendamento.paciente_nome,
                            start: agendamento.data_hora,
                            extendedProps: {
                                paciente: agendamento.paciente,
                                status: agendamento.status,
                                observacoes: agendamento.observacoes
                            }
                        }));
                        successCallback(eventos);
                    } catch (error) {
                        console.error('Erro ao carregar eventos:', error);
                        failureCallback(error);
                    }
                }
            });

            calendar.render();

            async function criarAgendamento(dataHora, motivo) {
                try {
                    const response = await fetch(`${API_BASE_URL}/agendamentos/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paciente: 1, // Substitua pelo ID do paciente correto
                            data_hora: dataHora,
                            motivo: motivo,
                            status: 'Pendente',
                            observacoes: ''
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao criar agendamento');
                    }

                    const novoAgendamento = await response.json();
                    alert('Agendamento criado com sucesso!');
                    calendar.refetchEvents(); // Atualiza os eventos no calendário
                } catch (error) {
                    console.error('Erro ao criar agendamento:', error);
                    alert('Erro ao criar agendamento.');
                }
            }

            async function carregarPacientesSelect() {
                const select = document.getElementById('paciente');
                select.innerHTML = '<option value="">Selecione um paciente</option>';
                try {
                    const response = await fetch(`${API_BASE_URL}/buscar-pacientes/`);
                    const pacientes = await response.json();
                    pacientes.forEach(paciente => {
                        const option = document.createElement('option');
                        option.value = paciente.id;
                        option.textContent = paciente.nome;
                        select.appendChild(option);
                    });
                } catch (error) {
                    console.error('Erro ao carregar pacientes:', error);
                    select.innerHTML = '<option value="">Erro ao carregar pacientes</option>';
                }
            }

            // Adicionar comportamento ao clicar em um evento
            calendar.on('eventClick', async function (info) {
                const modal = document.getElementById('eventModal');
                await carregarPacientesSelect();
                document.getElementById('paciente').value = info.event.extendedProps.paciente;
                document.getElementById('dataHora').value = info.event.start.toISOString().slice(0, 16);
                document.getElementById('motivo').value = info.event.title;
                document.getElementById('status').value = info.event.extendedProps.status;
                document.getElementById('observacoes').value = info.event.extendedProps.observacoes;

                modal.style.display = 'flex';

                // Fechar o modal ao clicar no botão de fechar
                document.querySelector('.close').onclick = function () {
                    modal.style.display = 'none';
                };

                // Fechar o modal ao clicar fora dele
                window.onclick = function (event) {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                };

                // Salvar as alterações
                document.getElementById('saveEvent').onclick = async function () {
                    try {
                        const updatedEvent = {
                            paciente: info.event.extendedProps.paciente,
                            data_hora: document.getElementById('dataHora').value,
                            motivo: document.getElementById('motivo').value,
                            status: document.getElementById('status').value,
                            observacoes: document.getElementById('observacoes').value,
                        };

                        const response = await fetch(`${API_BASE_URL}/agendamentos/${info.event.id}/`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedEvent),
                        });

                        if (!response.ok) {
                            throw new Error('Erro ao salvar alterações');
                        }

                        alert('Evento atualizado com sucesso!');
                        modal.style.display = 'none';
                        calendar.refetchEvents(); // Atualizar os eventos no calendário
                    } catch (error) {
                        console.error('Erro ao salvar alterações:', error);
                        alert('Erro ao salvar alterações.');
                    }
                };

                // Excluir o evento
                document.getElementById('deleteEvent').onclick = async function () {
                    if (confirm('Tem certeza que deseja excluir este evento?')) {
                        try {
                            const response = await fetch(`${API_BASE_URL}/agendamentos/${info.event.id}/`, {
                                method: 'DELETE',
                            });
                            if (!response.ok) {
                                throw new Error('Erro ao excluir evento');
                            }
                            alert('Evento excluído com sucesso!');
                            modal.style.display = 'none';
                            calendar.refetchEvents();
                        } catch (error) {
                            console.error('Erro ao excluir evento:', error);
                            alert('Erro ao excluir evento.');
                        }
                    }
                };

                document.getElementById('deleteEvent').style.display = 'inline-block';
            });

            document.getElementById('repetir').addEventListener('change', function() {
                const repetir = this.value;
                document.getElementById('repetirAte').style.display = repetir !== 'nao' ? 'inline-block' : 'none';
                document.getElementById('labelRepetirAte').style.display = repetir !== 'nao' ? 'inline-block' : 'none';
            });

            carregarPacientesSelect();
        });

        function formatarDataHora(dataISO, formatoHora = 24) {
            const data = new Date(dataISO);

            // Data no formato DD-MM-YY
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = String(data.getFullYear()).slice(-2);

            // Hora
            let horas = data.getHours();
            const minutos = String(data.getMinutes()).padStart(2, '0');
            let horaFormatada;

            if (formatoHora === 12) {
                const ampm = horas >= 12 ? 'PM' : 'AM';
                horas = horas % 12 || 12;
                horaFormatada = `${horas}:${minutos} ${ampm}`;
            } else {
                horaFormatada = `${String(horas).padStart(2, '0')}:${minutos}`;
            }

            return `${dia}-${mes}-${ano} ${horaFormatada}`;
        }
