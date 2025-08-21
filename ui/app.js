function callPythonReset() {
  if (window.pyodide) {
    window.pyodide.runPython('from labs import reset_all; reset_all()');
  }
}

const resetBtn = document.getElementById('reset');
const terminal = document.getElementById('terminal');

resetBtn.addEventListener('click', () => {
  callPythonReset();
  terminal.innerHTML = '';
});
