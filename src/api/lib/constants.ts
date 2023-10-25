export const corsWhitelist: string[] = ['*'];

export const { NODE_ENV, PORT } = process.env;
export const SUCCESSFUL = 'successful';
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const DA_SERVER = process.env.DA_SERVER as string;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string;

export const RANDOM_IMAGE_URLS = [
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=cellular-automata&cells=10',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=triangles&gap=100',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=mondrian',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=tiles',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=cubic-disarray',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=joy-division',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=123',
  'https://generative-placeholders.glitch.me/image?width=300&height=300&style=circles',
];
