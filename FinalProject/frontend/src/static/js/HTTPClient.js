const handleError = (res) => {
    if(!res.ok) {
      if(res.status == 401) {
        localStorage.removeItem('user');
        throw new Error("Unauthenticated, Please Try Again");
      }
      else {
        throw new Error(res.json().error)
      }
    }
    return res;
  };
  
  export default {
    get: (url) => {
      return fetch(url, {
        credentials: 'include',
        headers: {
        }
      }).then(handleError).then(res => {
        return res.json();
      });
    },
  
    post: (url, data) => {
      return fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(handleError).then(res => {
        return res.json();
      });
    },
  
    put: (url, data) => {
      return fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(handleError).then(res => {
        return res.json();
      });
  
    },
  
    delete: (url, data) => {
      return fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(handleError).then(res => {
        return res.json();
      });
    },
  
  };