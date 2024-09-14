export class UserAlreadyExistsError extends Error {
  constructor() {
    super("O email informado já está cadastrado");
  }
}
