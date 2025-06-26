// LoginUseCase handles the login logic
import type { User } from '../../core/domain/entities/User';
import type { UserRepository } from '../../core/domain/repositories/UserRepository';

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<User> {
    return this.userRepository.login(username, password);
  }
}
