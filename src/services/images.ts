/**
 * Optimiza URLs de Google Drive para solicitar dimensiones ideales
 * Reduce el peso de transferencia en más del 70% en dispositivos móviles
 */
export function getOptimizedImageUrl(url?: string, width: number = 400): string {
  if (!url) {
    return `https://lh3.googleusercontent.com/d/14SZHVUlEXOKEcuJKl_cfaz49oPnml_73=w${width}`;
  }
  if (url.includes('googleusercontent.com/d/')) {
    if (/=w\d+/.test(url)) {
      return url.replace(/=w\d+/, `=w${width}`);
    }
    return `${url}=w${width}`;
  }
  return url;
}
