import {LOGIN_API_URL} from '../constants/declarations'

// Get the value of a cookie with a given name
export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(`${name}=`.length, cookie.length);
      }
    }
    return '';
  }
  
  // Set a cookie with a given name, value, and expiration time (in days)
  export function setCookie(name, value, expiration) {
    const date = new Date();
    date.setTime(date.getTime() + (expiration * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }


  export function isUserAuth(jwtToken) {
    return new Promise((resolve, reject) => {
      if (jwtToken) {
        fetch(LOGIN_API_URL + "/protected", {
          method: 'GET',
          credentials: 'include', // send cookies with the request
          headers: { 'Authorization': `Bearer ${jwtToken}`},
        }) 
        .then((response) => response.json())
        .then((data) => {
          if (data.authData.username !== null && data.authData.username !== undefined) {
            resolve({isAuth: true, username: data.authData.username});
          } else {
            resolve({isAuth: false, username: null});
          }
        })
        .catch((error) => {
          console.error(error);
          // reject(error);
          resolve({isAuth: false, username: null});
        });
      }
    });
  }


// Delete a cookie with a given name
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
  return true;
}
