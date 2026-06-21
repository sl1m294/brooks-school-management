import { ApiError } from "../../common/errors/api-error.js";
import { signAccessToken, signRefreshToken } from "../../common/security/jwt.js";
import { verifyPassword } from "../../common/security/password.js";
import { authRepository } from "./auth.repository.js";

const toPublicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName
});

export const authService = {
  async login({ email, password }) {
    const user = await authRepository.findActiveUserByEmail(email);

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const passwordMatches = await verifyPassword(user.passwordHash, password);

    if (!passwordMatches) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    await authRepository.updateLastLogin(user.id);

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      user: toPublicUser(user),
      accessToken: signAccessToken(tokenPayload),
      refreshToken: signRefreshToken(tokenPayload)
    };
  },

  getCurrentUser(authUser) {
    return authUser;
  }
};

