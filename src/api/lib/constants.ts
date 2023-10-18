export const corsWhitelist: string[] = ['*'];

export const { NODE_ENV, PORT } = process.env;
export const SUCCESSFUL = 'successful';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
