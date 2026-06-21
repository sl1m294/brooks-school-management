import argon2 from "argon2";

export const hashPassword = (password) => {
  return argon2.hash(password);
};

export const verifyPassword = (passwordHash, password) => {
  return argon2.verify(passwordHash, password);
};

