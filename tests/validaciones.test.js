const V = require('../validaciones.js');

// HU-01: Como visitante quiero que el formulario valide mis datos para corregir errores antes de enviar.
describe('HU-01 Contraseña segura', () => {
  test('acepta una contraseña válida', () => {
    expect(V.validarPassword('Segura123')).toBe('');
  });
  test('rechaza menos de 8 caracteres', () => {
    expect(V.validarPassword('Ab1cdef')).toBe('Debe tener al menos 8 caracteres.');
  });
  test('exige mayúscula, minúscula y número', () => {
    expect(V.validarPassword('segura123')).toMatch(/mayúscula/);
    expect(V.validarPassword('SEGURA123')).toMatch(/minúscula/);
    expect(V.validarPassword('SeguraAbc')).toMatch(/número/);
  });
  test('rechaza vacío', () => {
    expect(V.validarPassword('')).toBe('Escribe una contraseña.');
  });
});

describe('HU-02 Cédula ecuatoriana', () => {
  test('acepta una cédula con dígito verificador correcto', () => {
    expect(V.validarCedula('1710034065')).toBe('');
  });
  test('rechaza dígito verificador incorrecto', () => {
    expect(V.validarCedula('1710034064')).toBe('La cédula no es válida.');
  });
  test('rechaza provincia inexistente', () => {
    expect(V.validarCedula('9910034065')).toBe('La cédula no es válida.');
  });
  test('rechaza longitud incorrecta', () => {
    expect(V.validarCedula('12345')).toMatch(/10 dígitos/);
  });
});

describe('HU-03 Teléfono, correo y nombre', () => {
  test('teléfono móvil válido empieza con 09', () => {
    expect(V.validarTelefono('0991234567')).toBe('');
    expect(V.validarTelefono('0891234567')).toMatch(/09/);
  });
  test('correo con formato válido / inválido', () => {
    expect(V.validarCorreo('ana@correo.com')).toBe('');
    expect(V.validarCorreo('ana@correo')).toMatch(/formato válido/);
  });
  test('nombre requiere nombre y apellido', () => {
    expect(V.validarNombre('Ana Pérez')).toBe('');
    expect(V.validarNombre('Ana')).toBe('Escribe nombre y apellido.');
    expect(V.validarNombre('Ana 123')).toMatch(/letras/);
  });
});

describe('HU-04 Confirmación y términos', () => {
  test('las contraseñas deben coincidir', () => {
    expect(V.validarConfirmar('Segura123', 'Segura123')).toBe('');
    expect(V.validarConfirmar('Otra1234', 'Segura123')).toBe('Las contraseñas no coinciden.');
  });
  test('los términos deben aceptarse', () => {
    expect(V.validarTerminos(true)).toBe('');
    expect(V.validarTerminos(false)).toMatch(/términos/);
  });
});
