export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
}

export async function getAddress(lat, lon) {
  // const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  // try {
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   return data.display_name;
  // } catch (error) {
  //   console.error("Error fetching address:", error);
  // }
}

// // Example usage:
// getAddress(17.4343459, 78.3948765);
