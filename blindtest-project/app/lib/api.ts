const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchPlaylistByGenre(genre: string, limit: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/playlist/${genre}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.slice(0, limit); 
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
}

export async function fetchPlaylistByGameCode(gameCode: string) {
  const response = await fetch(`${API_BASE_URL}/playlist/${gameCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch playlist');
  }
  return response.json();
}
