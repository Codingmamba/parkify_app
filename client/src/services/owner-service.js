import { ownerAuthHeader } from '../helpers';
import axios from 'axios';

export const ownerService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch('/owners/authenticate', requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }

            return response.json();
        })
        .then(owner => {
            // login successful if there's a jwt token in the response
            if (owner && owner.token) {
                // store owner details and jwt token in local storage to keep owner logged in between page refreshes
                localStorage.setItem('owner', JSON.stringify(owner));
            }

            return owner;
        });
}

function logout() {
    // remove owner from local storage to log owner out
    localStorage.removeItem('owner');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: ownerAuthHeader()
    };

    return axios.get('/owner', requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: ownerAuthHeader()
    };

    return axios.get('/owners/' + id, requestOptions).then(handleResponse);
}

function register(owner) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(owner)
    };

    return axios.post('/owner', requestOptions).then(handleResponse);
}

function update(owner) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...ownerAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(owner)
    };

    return axios.get('/owners/' + owner.id, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: ownerAuthHeader()
    };

    return axios.delete('/owners/' + id, requestOptions).then(handleResponse);;
}

function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}