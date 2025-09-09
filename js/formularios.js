

// Sistema de Cadastro
function iniciarCadastro() {
  const form = document.getElementById('formCadastro');
  if (!form) return;

  // Restaurar rascunho do localStorage
  restaurarRascunho();

  // Auto-save enquanto digita
  form.addEventListener('input', salvarRascunho);

  // Validação no submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      mostrarToast('Verifique os campos obrigatórios', 'error');
      return;
    }

    salvarCadastro();
  });

  // Reset do formulário
  form.addEventListener('reset', () => {
    localStorage.removeItem('cadastro_rascunho');
    form.classList.remove('was-validated');
    mostrarToast('Formulário limpo', 'info');
  });

  // Máscaras de entrada
  aplicarMascaras();
}

// Função para restaurar rascunho
function restaurarRascunho() {
  try {
    const rascunho = localStorage.getItem('cadastro_rascunho');
    if (!rascunho) return;

    const dados = JSON.parse(rascunho);
    const form = document.getElementById('formCadastro');

    Object.entries(dados).forEach(([campo, valor]) => {
      const elemento = form.elements[campo];
      if (!elemento) return;

      if (elemento.type === 'radio') {
        const radio = form.querySelector(`[name="${campo}"][value="${valor}"]`);
        if (radio) radio.checked = true;
      } else if (elemento.type === 'checkbox') {
        elemento.checked = Boolean(valor);
      } else {
        elemento.value = valor;
      }
    });

  } catch (erro) {
    console.warn('Erro ao restaurar rascunho:', erro);
  }
}

// Função para salvar rascunho
function salvarRascunho() {
  try {
    const form = document.getElementById('formCadastro');
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());
    
    // Tratar checkbox separadamente
    dados.newsletter = document.getElementById('newsletter')?.checked ? 1 : 0;
    
    localStorage.setItem('cadastro_rascunho', JSON.stringify(dados));
  } catch (erro) {
    console.warn('Erro ao salvar rascunho:', erro);
  }
}

// Função para salvar cadastro final
function salvarCadastro() {
  try {
    const form = document.getElementById('formCadastro');
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());
    
    dados.newsletter = document.getElementById('newsletter')?.checked ? 1 : 0;
    dados.dataHoraCadastro = new Date().toISOString();

    // Salvar cadastro permanente
    localStorage.setItem('cadastro_permanente', JSON.stringify(dados));
    
    // Limpar rascunho
    localStorage.removeItem('cadastro_rascunho');

    mostrarToast('Cadastro salvo com sucesso!', 'success');
    
    form.reset();
    form.classList.remove('was-validated');
    
  } catch (erro) {
    console.error('Erro ao salvar cadastro:', erro);
    mostrarToast('Erro ao salvar cadastro', 'error');
  }
}

// Função para aplicar máscaras
function aplicarMascaras() {
  
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = valor;
    });
  }

  // Máscara CEP
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
      e.target.value = valor;
    });
  }

  // Máscara telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let valor = e.target.value.replace(/\D/g, '');
      if (valor.length <= 10) {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
      }
      e.target.value = valor;
    });
  }
}

// Sistema de Agendamento
function iniciarAgendamento() {
  const form = document.getElementById('formAgendamento');
  if (!form) return;

  const inputData = document.getElementById('data');
  const inputHora = document.getElementById('hora');

  // Configurar regras de horário quando serviço muda
  const radiosServico = document.querySelectorAll('input[name="servico"]');
  radiosServico.forEach(radio => {
    radio.addEventListener('change', aplicarRegrasHorario);
  });

  // Validação no submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const servico = document.querySelector('input[name="servico"]:checked');
    const erroServico = document.getElementById('erroServico');

    if (!servico) {
      if (erroServico) erroServico.style.display = 'block';
      mostrarToast('Selecione o tipo de serviço', 'error');
      return;
    } else {
      if (erroServico) erroServico.style.display = 'none';
    }

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      mostrarToast('Preencha todos os campos', 'error');
      return;
    }

    if (!validarHorarioFuncionamento()) {
      return;
    }

    salvarAgendamento();
  });

  // Reset do formulário
  form.addEventListener('reset', () => {
    form.classList.remove('was-validated');
    setTimeout(aplicarRegrasHorario, 100);
  });

  // Aplicar regras iniciais
  setTimeout(aplicarRegrasHorario, 100);
}

// Função para aplicar regras de horário
function aplicarRegrasHorario() {
  const servicoSelecionado = document.querySelector('input[name="servico"]:checked')?.value;
  const inputData = document.getElementById('data');
  const inputHora = document.getElementById('hora');
  
  if (!servicoSelecionado || !inputData || !inputHora) return;

  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  
  // Configurar limites de data
  inputData.min = formatarData(hoje);
  inputData.max = formatarData(adicionarDias(hoje, 30));

  let dataMinima = hoje;
  let horaMinima = 8; // 08:00

  if (servicoSelecionado === 'retirada') {
    // Retirada: mesmo dia com 2h de antecedência
    const duasHorasDepois = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
    
    if (duasHorasDepois.getDate() === agora.getDate() && duasHorasDepois.getHours() < 20) {
      dataMinima = hoje;
      horaMinima = Math.max(duasHorasDepois.getHours(), 8);
    } else {
      dataMinima = adicionarDias(hoje, 1);
      horaMinima = 8;
    }
  } else if (servicoSelecionado === 'entrega') {
    // Entrega= próximo dia útil
    dataMinima = proximoDiaUtil(hoje);
    horaMinima = 8;
  }

  // Aplicar valores
  inputData.value = formatarData(dataMinima);
  inputHora.value = String(horaMinima).padStart(2, '0') + ':00';
  inputHora.min = '08:00';
  inputHora.max = '20:00';
}

// Função para validar horário de funcionamento
function validarHorarioFuncionamento() {
  const inputHora = document.getElementById('hora');
  if (!inputHora) return true;

  const [hora, minuto] = inputHora.value.split(':').map(Number);

  if (hora < 8 || hora > 20 || (hora === 20 && minuto > 0)) {
    mostrarToast('Horário deve estar entre 08:00 e 20:00', 'error');
    inputHora.focus();
    return false;
  }

  return true;
}

// Função para salvar agendamento
function salvarAgendamento() {
  try {
    const form = document.getElementById('formAgendamento');
    const formData = new FormData(form);
    const dadosAgendamento = Object.fromEntries(formData.entries());
    
    dadosAgendamento.dataHoraAgendamento = new Date().toISOString();
    dadosAgendamento.status = 'confirmado';

    // Salvar agendamento
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos.push(dadosAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    const tipoServico = dadosAgendamento.servico === 'retirada' ? 'retirada' : 'entrega';
    const dataFormatada = new Date(dadosAgendamento.data).toLocaleDateString('pt-BR');
    
    mostrarToast(`Agendamento confirmado! ${tipoServico} em ${dataFormatada} às ${dadosAgendamento.hora}`, 'success');

    form.reset();
    form.classList.remove('was-validated');
    setTimeout(aplicarRegrasHorario, 100);

  } catch (erro) {
    console.error('Erro ao salvar agendamento:', erro);
    mostrarToast('Erro ao confirmar agendamento', 'error');
  }
}

// Funções utilitárias
function formatarData(data) {
  return data.toISOString().slice(0, 10);
}

function adicionarDias(data, dias) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}

function proximoDiaUtil(data) {
  const diaSemana = data.getDay(); // 0 = domingo, 6 = sábado
  if (diaSemana === 5) return adicionarDias(data, 3); // sexta -> segunda
  if (diaSemana === 6) return adicionarDias(data, 2); // sábado -> segunda
  return adicionarDias(data, 1); // outros dias -> próximo dia
}