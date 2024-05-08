const NODE_ENV: string | undefined = process.env.NODE_ENV
const baseURL: string = process.env.NODE_ENV == 'development' ? "/admin" : 'https://api2.allinnb.com/admin';
export default baseURL;
