export const BASE_PATH = "/ewha-gis-lab";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
