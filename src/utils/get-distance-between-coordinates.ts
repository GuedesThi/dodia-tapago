export interface Coordinate {
  latitude: number;
  longitude: number;
}

// fórmula do haversine
export function getDistanceBetweenCoordinates(ondeEstou: Coordinate, queroIr: Coordinate) {
    if (ondeEstou.latitude === queroIr.latitude && ondeEstou.longitude === queroIr.longitude) {
        return 0;
    }

    const ondeEstouEmRadiano = (Math.PI * ondeEstou.latitude) / 180;
    const queroIrEmRadiano = (Math.PI * queroIr.latitude) / 180;

    const theta = ondeEstou.longitude - queroIr.longitude;
    const radianoTheta = (Math.PI * theta) / 180;

    let distancia = 
        Math.sin(ondeEstouEmRadiano) * Math.sin(queroIrEmRadiano) + 
        Math.cos(ondeEstouEmRadiano) * Math.cos(queroIrEmRadiano) * 
        Math.cos(radianoTheta);

    if (distancia > 1) {
        distancia = 1
    }

    distancia = Math.acos(distancia);
    distancia = (distancia * 180) / Math.PI;
    distancia = distancia * 60 * 1.1515;
    distancia = distancia * 1.609344

    return distancia;
}
