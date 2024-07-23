
export function toBold(str, query) {

    if(!query || query.length == 0)
        return str;

    const n = str.toUpperCase();
    const q = query.toUpperCase();
    const x = n.indexOf(q);
    if (!q || x === -1) {
        return str; // bail early
    }
    const l = q.length;
    return str.substr(0, x) + '<b>' + str.substr(x, l) + '</b>' + str.substr(x + l);
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
}