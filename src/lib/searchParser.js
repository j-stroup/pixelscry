// src/lib/searchParser.js
export function parseSearch(query) {
    // Split by spaces, but keep quoted strings together
    const tokens = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    
    let textSearch = [];
    let filters = [];

    tokens.forEach(token => {
        // Look for syntax like key:value, key>value, key<value
        let match = token.match(/([a-zA-Z]+)(:|>=|<=|>|<)(.+)/);
        
        if (match) {
            filters.push({ 
                key: match[1].toLowerCase(), 
                op: match[2], 
                val: match[3].replace(/"/g, '') // remove quotes
            });
        } else {
            textSearch.push(token);
        }
    });

    return {
        text: textSearch.join(' '),
        filters
    };
}