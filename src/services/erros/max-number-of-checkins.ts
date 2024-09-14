export class MaxNumberOfCheckinsError extends Error {
  constructor() {
    super("Você não pode fazer mais de 2 check-ins no mesmo dia.");
  }
}
