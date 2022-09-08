//   操作本地中的token

const TOKEN_NAME = 'hkzf_token'

function getToken() {
    return localStorage.getItem(TOKEN_NAME)
}

function hasToken() {
    return !!getToken()
}

function setToken(token) {
    localStorage.setItem(TOKEN_NAME, token)
}

function removeToken() {
    localStorage.removeItem(TOKEN_NAME)
}
export {getToken, hasToken, setToken, removeToken}
