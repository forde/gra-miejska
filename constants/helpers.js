const bearing = ( lat1,  long1,  lat2,  long2) => {
    const degToRad = Math.PI / 180.0;
    const phi1 = lat1 * degToRad;
    const phi2 = lat2 * degToRad;
    const lam1 = long1 * degToRad;
    const lam2 = long2 * degToRad;

    return Math.atan2(Math.sin(lam2-lam1)*Math.cos(phi2),
        Math.cos(phi1)*Math.sin(phi2) - Math.sin(phi1)*Math.cos(phi2)*Math.cos(lam2-lam1)
    ) * 180/Math.PI;
}
const initialBearing = ( lat1,  long1,  lat2,  long2) => {
    return (bearing(lat1, long1, lat2, long2) + 360) % 360;
}
export const finalBearing = ( lat1,  long1,  lat2,  long2) => {
    return (bearing(lat2, long2, lat1, long1) + 180) % 360;
}