const API_BASE_URL = 'http://87.106.162.205:5002/api';

export async function fetchPlaylistByGenre(genre: string) {
  const response = await fetch(`${API_BASE_URL}/playlist/${genre}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playlist');
  }
  return response.json();
}

export async function fetchPlaylistByGameCode(gameCode: string) {
  const response = await fetch(`${API_BASE_URL}/playlist/${gameCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playlist');
  }
  return response.json();
}
