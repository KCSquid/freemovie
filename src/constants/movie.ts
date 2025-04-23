export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string;
  release_date: string;
  first_air_date?: string;
  unavailable: boolean;
  isClicked: boolean;
}
