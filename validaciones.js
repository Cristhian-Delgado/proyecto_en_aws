// Lógica de validación pura (sin DOM): se puede probar con Jest y usar en el navegador.
(function (root) {
  'use strict';

  function validarNombre(v) {
    v = (v || '').trim();
    if (!v) return 'Escribe tu nombre completo.';
    if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(v)) return 'El nombre solo puede tener letras.';
    if (v.split(/\s+/).length < 2) return 'Escribe nombre y apellido.';
    return '';
  }

  function validarCorreo(v) {
    v = (v || '').trim();
    if (!v) return 'Escribe tu correo electrónico.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'El correo no tiene un formato válido (ej. nombre@correo.com).';
    return '';
  }

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

  function validarCedula(v) {
    if (!v) return 'Escribe tu número de cédula.';
    if (!/^\d{10}$/.test(v)) return 'La cédula debe tener 10 dígitos numéricos.';
    return cedulaEcuatorianaValida(v) ? '' : 'La cédula no es válida.';
  }

  function validarTelefono(v) {
    if (!v) return 'Escribe tu teléfono.';
    if (!/^09\d{8}$/.test(v)) return 'Debe tener 10 dígitos y empezar con 09.';
    return '';
  }

  function validarPassword(v) {
    if (!v) return 'Escribe una contraseña.';
    if (v.length < 8) return 'Debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(v)) return 'Agrega al menos una letra mayúscula.';
    if (!/[a-z]/.test(v)) return 'Agrega al menos una letra minúscula.';
    if (!/\d/.test(v)) return 'Agrega al menos un número.';
    return '';
  }

  function validarConfirmar(v, password) {
    if (!v) return 'Repite la contraseña.';
    if (v !== password) return 'Las contraseñas no coinciden.';
    return '';
  }

  function validarTerminos(aceptado) {
    return aceptado ? '' : 'Debes aceptar los términos para continuar.';
  }

  const api = {
    validarNombre, validarCorreo, validarCedula, validarTelefono,
    validarPassword, validarConfirmar, validarTerminos, cedulaEcuatorianaValida
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Validaciones = api;
})(typeof self !== 'undefined' ? self : this);
