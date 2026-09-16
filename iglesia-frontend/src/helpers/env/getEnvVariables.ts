export interface EnvVariables {
  VITE_API_URL: string;
  VITE_cloudUlr: string;
}

export const getEnvVariables = () => {
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_cloudUlr: import.meta.env.VITE_cloudUlr,
  };
};
