// Lista básica de palabras de diccionario
const dictionaryWords = [
  "almohada",
  "contraseña",
  "password",
  "admin",
  "welcome",
  "qwerty",
  "nombre",
  "amigo",
  "seguridad",
  "fácil"
];

// Función para validar la contraseña
function isSecurePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoSpaces = !/\s/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    hasNoSpaces
  );
}

// Función para verificar palabras de diccionario
function containsDictionaryWord(password) {
  const lowercasePassword = password.toLowerCase();
  return dictionaryWords.some((word) => lowercasePassword.includes(word));
}

// Función para proporcionar recomendaciones
function getPasswordRecommendations(password) {
  const recommendations = [];

  if (password.length === 8) {
    recommendations.push("Considera usar una contraseña más larga para mayor seguridad.");
  } else if (password.length < 8) {
    recommendations.push("Tu contraseña es muy corta. Usa al menos 8 caracteres.");
  }

  if (!/[A-Z]/.test(password)) {
    recommendations.push("Añade al menos una letra mayúscula.");
  }

  if (!/[a-z]/.test(password)) {
    recommendations.push("Incluye al menos una letra minúscula.");
  }

  if (!/\d/.test(password)) {
    recommendations.push("Añade al menos un número.");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    recommendations.push("Incluye al menos un carácter especial (por ejemplo, !, @, #).");
  }

  if (/\s/.test(password)) {
    recommendations.push("No uses espacios en tu contraseña.");
  }

  if (containsDictionaryWord(password)) {
    recommendations.push("Evita usar palabras de diccionario o nombres propios en tu contraseña.");
  }

  return recommendations;
}

// Función para estimar el tiempo de descifrado
function estimateCrackTime(password) {
  const ratesPerSecond = 1_000_000_000; // 1 billón de intentos por segundo

  // Contar tipos de caracteres en la contraseña
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Determinar el tamaño del espacio de búsqueda
  let charsetSize = 0;
  if (hasUpperCase) charsetSize += 26;
  if (hasLowerCase) charsetSize += 26;
  if (hasNumber) charsetSize += 10;
  if (hasSpecialChar) charsetSize += 33;

  // Número total de combinaciones posibles
  const totalCombinations = Math.pow(charsetSize, password.length);

  // Calcular tiempo en segundos
  const crackTimeSeconds = totalCombinations / ratesPerSecond;

  // Convertir a formato legible (segundos, minutos, horas, años)
  if (crackTimeSeconds < 60) {
    return `${Math.round(crackTimeSeconds)} segundos`;
  } else if (crackTimeSeconds < 3600) {
    return `${Math.round(crackTimeSeconds / 60)} minutos`;
  } else if (crackTimeSeconds < 86400) {
    return `${Math.round(crackTimeSeconds / 3600)} horas`;
  } else if (crackTimeSeconds < 31536000) {
    return `${Math.round(crackTimeSeconds / 86400)} días`;
  } else {
    return `${Math.round(crackTimeSeconds / 31536000)} años`;
  }
}

// Referencia a elementos del DOM
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");
const checkButton = document.getElementById("checkPassword");
const message = document.getElementById("message");

// Evento para alternar la visibilidad de la contraseña
togglePasswordButton.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  togglePasswordButton.textContent = type === "password" ? "👁️" : "🙈";
});

// Evento al hacer clic en el botón "Verificar Contraseña"
checkButton.addEventListener("click", () => {
  const password = passwordInput.value;

  if (password.trim() === "") {
    message.style.color = "#e74c3c";
    message.textContent = "Por favor, introduce una contraseña.";
    return;
  }

  const crackTime = estimateCrackTime(password);
  const recommendations = getPasswordRecommendations(password);

  if (isSecurePassword(password)) {
    if (containsDictionaryWord(password)) {
      message.style.color = "#f1c40f";
      message.innerHTML = `✔️ Tu contraseña es segura, pero detectamos que contiene palabras comunes.<br>🕒 Tiempo estimado para descifrarla: <b>${crackTime}</b><br><br>🔍 <b>Recomendaciones:</b><ul>${recommendations
        .map((rec) => `<li>${rec}</li>`)
        .join("")}</ul>`;
    } else {
      message.style.color = "#16a085";
      message.innerHTML = `✔️ Tu contraseña es segura.<br>🕒 Tiempo estimado para descifrarla: <b>${crackTime}</b>`;
    }
  } else {
    message.style.color = "#e74c3c";
    message.innerHTML = `❌ Tu contraseña no es segura.<br>🕒 Tiempo estimado para descifrarla: <b>${crackTime}</b><br><br>🔍 <b>Recomendaciones:</b><ul>${recommendations
      .map((rec) => `<li>${rec}</li>`)
      .join("")}</ul>`;
  }
});
