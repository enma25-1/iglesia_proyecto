export const agregarTransparencia = (color: string, alpha: number) => {
  return color.replace("rgb", "rgba").replace(")", `, ${alpha})`);
};
