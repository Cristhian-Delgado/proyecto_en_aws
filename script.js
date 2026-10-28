'use strict';

const form = document.getElementById('formulario');
const mensajeExito = document.getElementById('mensaje-exito');

// Cada validador devuelve un texto de error, o '' si el valor es correcto.
const validadores = {
  nombre(v) {
    v = v.trim();
    if (!v) return 'Escribe tu nombre completo.';
    if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(v)) return 'El nombre solo puede tener letras.';
    if (v.split(/\s+/).length < 2) return 'Escribe nombre y apellido.';
    return '';
  },
  correo(v) {
    v = v.trim();
    if (!v) return 'Escribe tu correo electrónico.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'El correo no tiene un formato válido (ej. nombre@correo.com).';
    return '';
  },
  cedula(v) {
    if (!v) return 'Escribe tu número de cédula.';
    if (!/^\d{10}$/.test(v)) return 'La cédula debe tener 10 dígitos numéricos.';
    return cedulaEcuatorianaValida(v) ? '' : 'La cédula no es válida.';
  },
  telefono(v) {
    if (!v) return 'Escribe tu teléfono.';
    if (!/^09\d{8}$/.test(v)) return 'Debe tener 10 dígitos y empezar con 09.';
    return '';
  },
  password(v) {
    if (!v) return 'Escribe una contraseña.';
    if (v.length < 8) return 'Debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(v)) return 'Agrega al menos una letra mayúscula.';
    if (!/[a-z]/.test(v)) return 'Agrega al menos una letra minúscula.';
    if (!/\d/.test(v)) return 'Agrega al menos un número.';
    return '';
  },
  confirmar(v) {
    if (!v) return 'Repite la contraseña.';
    if (v !== form.password.value) return 'Las contraseñas no coinciden.';
    return '';
  },
  terminos() {
    return form.terminos.checked ? '' : 'Debes aceptar los términos para continuar.';
  }
};

// Algoritmo oficial de validación de cédula de Ecuador.
function cedulaEcuatorianaValida(ci) {
  const provincia = parseInt(ci.slice(0, 2), 10);
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) return false;
  if (parseInt(ci[2], 10) >= 6) return false;

  const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let p = parseInt(ci[i], 10) * coef[i];
    if (p > 9) p -= 9;
    suma += p;
  }
  const digito = (10 - (suma % 10)) % 10;
  return digito === parseInt(ci[9], 10);
}

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
    if (nombre === 'password' && form.confirmar.value) validarCampo('confirmar');
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
    mensajeExito.textContent = '¡Cuenta creada correctamente, ' + form.nombre.value.trim().split(/\s+/)[0] + '!';
    mensajeExito.hidden = false;
    form.reset();
    form.querySelectorAll('.valido').forEach((el) => el.classList.remove('valido'));
  } else if (primerError) {
    primerError.focus();
  }
});
