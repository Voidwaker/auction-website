export function save(key, value) {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value)); 
    }
}

export function load(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;  
}

export function remove(key) {
    localStorage.removeItem(key);
}

