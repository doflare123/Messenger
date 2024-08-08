import * as Crypto from 'expo-crypto';

// Функция для генерации соли
export const generateSalt = async () => {
  const salt = Crypto.getRandomBytes(16);
  return salt.toString('hex'); // Конвертируем байты в шестнадцатеричную строку
};

// Функция для хеширования пароля с солью
export const hashPassword = async (password, salt) => {
  // Создаем строку из пароля и соли
  const data = password + salt;

  // Хешируем строку
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    data,
    { encoding: Crypto.CryptoEncoding.HEX } // Хешируем и конвертируем в шестнадцатеричную строку
  );

  return hash;
};
