const KEY = "token";

export const saveToken = (t: string) => localStorage.setItem(KEY, t);
export const loadToken = () => localStorage.getItem(KEY);
export const clearToken = () => localStorage.removeItem(KEY);
