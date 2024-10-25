import Cookies from 'js-cookie';



export function getCsrfToken(): string {
    const token: string | undefined = Cookies.get('csrftoken');

    if (!token) {
        throw 'CSRF token not set';
    }

    return token;
}