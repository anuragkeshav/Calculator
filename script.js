
const display = document.querySelector('input[type="text"]');
const buttons = document.querySelectorAll('button');

const historyToggle = document.querySelector('.history-toggle');
const historyPanel  = document.querySelector('.history-panel');
const historyList   = document.getElementById('historyList');


let currentInput = '';
let history = [];
let lastInputWasOperator = false;


function updateDisplay(value = '') {
  display.value = value || '0';
}


function calculate() {
  if (!currentInput || /[\+\-\*\/.]$/.test(currentInput)) return;

  try {
    const expression = currentInput;
    const result = Function(`"use strict"; return (${expression})`)();

    addToHistory(expression, result);
    currentInput = result.toString();
    updateDisplay(currentInput);
    lastInputWasOperator = false;

  } catch {
    updateDisplay('Error');
    currentInput = '';
  }
}


function addToHistory(expr, result) {
  history.unshift({ expr, result });

  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';

  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.expr} = ${item.result}`;

    li.addEventListener('click', () => {
      currentInput = item.result.toString();
      updateDisplay(currentInput);
      historyPanel.classList.remove('show');
    });

    historyList.appendChild(li);
  });
}


function handleInput(value) {

  if (value === 'C' || value === 'AC') {
    currentInput = '';
    updateDisplay();
    lastInputWasOperator = false;
    return;
  }

  if (value === '=') {
    calculate();
    return;
  }

  if (value === '±') {
    if (!currentInput) return;
    currentInput = (-parseFloat(currentInput)).toString();
    updateDisplay(currentInput);
    return;
  }

  if (value === '%') {
    if (!currentInput) return;
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay(currentInput);
    return;
  }

  
  if (/[\+\-\*\/]/.test(value)) {
    if (lastInputWasOperator) return;
    lastInputWasOperator = true;
    currentInput += value;
    updateDisplay(currentInput);
    return;
  }


  lastInputWasOperator = false;
  currentInput += value;
  updateDisplay(currentInput);
}


buttons.forEach(btn => {


  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    handleInput(btn.textContent);
  }, { passive: false });

  
  btn.addEventListener('click', () => {
    handleInput(btn.textContent);
  });

});


historyToggle.addEventListener('click', e => {
  e.stopPropagation();
  historyPanel.classList.toggle('show');
});

document.addEventListener('click', e => {
  if (!historyPanel.contains(e.target)) {
    historyPanel.classList.remove('show');
  }
});


document.addEventListener('keydown', e => {

  const key = e.key;

  if (!isNaN(key)) {
    handleInput(key);
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    handleInput(key);
    return;
  }

  if (key === '.' && !currentInput.endsWith('.')) {
    handleInput('.');
    return;
  }

  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
    return;
  }

  if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
    return;
  }

  if (key === 'Escape') {
    currentInput = '';
    updateDisplay();
  }

});