export class ResourceNotFoundError extends Error {
  constructor() {
    super("Conteúdo não encontrado");
  }
}
