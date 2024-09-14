export class MaxDistanceError extends Error {
  constructor() {
    super(
      "Você ultrapassou a distância máxima permitida de 100m dessa acadêmia."
    );
  }
}
