export interface CustomError extends Error {
  statusCode?: number;
  details?: string;
}
