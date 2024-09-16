export class LateCheckinValidationError extends Error {
  constructor() {
    super(
      "O check-in foi criado a mais de 20 minutos, não podendo mais ser validado."
    );
  }
}
