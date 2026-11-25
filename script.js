'use strict';

const form = document.getElementById('formulario');
const mensajeExito = document.getElementById('mensaje-exito');

// Cada validador devuelve un texto de error, o '' si el valor es correcto.
// La lógica vive en validaciones.js (probada automáticamente con Jest).
const V = window.Validaciones;
const validadores = {
  nombre: (v) => V.validarNombre(v),
  correo: (v) => V.validarCorreo(v),
  cedula: (v) => V.validarCedula(v),
  telefono: (v) => V.validarTelefono(v),
  password: (v) => V.validarPassword(v),
  confirmar: (v) => V.validarConfirmar(v, form.elements.password.value),
  terminos: () => V.validarTerminos(form.elements.terminos.checked)
};

function validarCampo(nombre) {
  const campo = form.elements[nombre];
  const valor = campo.type === 'checkbox' ? campo.checked : campo.value;
  const error = validadores[nombre](valor);
  const aviso = document.getElementById('error-' + nombre);

  aviso.textContent = error;
  if (campo.type !== 'checkbox') {
    campo.classList.toggle('invalido', !!error);
    campo.classList.toggle('valido', !error);
  }
  campo.setAttribute('aria-invalid', error ? 'true' : 'false');
  return !error;
}

// Validar al salir del campo y revalidar mientras se corrige.
Object.keys(validadores).forEach((nombre) => {
  const campo = form.elements[nombre];
  const evento = campo.type === 'checkbox' ? 'change' : 'input';
  campo.addEventListener('blur', () => validarCampo(nombre));
  campo.addEventListener(evento, () => {
    if (campo.classList.contains('invalido') || campo.type === 'checkbox') validarCampo(nombre);
    if (nombre === 'password' && form.elements.confirmar.value) validarCampo('confirmar');
  });
});

// Cédula y teléfono: solo permitir números.
['cedula', 'telefono'].forEach((nombre) => {
  form.elements[nombre].addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  mensajeExito.hidden = true;

  const resultados = Object.keys(validadores).map(validarCampo);
  const primerError = form.querySelector('.invalido');

  if (resultados.every(Boolean)) {
    mensajeExito.textContent = '¡Cuenta creada correctamente, ' + form.elements.nombre.value.trim().split(/\s+/)[0] + '!';
    mensajeExito.hidden = false;
    form.reset();
    form.querySelectorAll('.valido').forEach((el) => el.classList.remove('valido'));
  } else if (primerError) {
    primerError.focus();
  }
});
