// Client-side "collection" of owned games — localStorage only, no accounts.
// Safe to import from server-rendered components: on the server
// `localStorage` doesn't exist, so state simply starts empty and never
// mutates there (mutations only ever happen from click handlers, which
// only run in the browser). The real list is picked up on the client once
// the module re-evaluates in the browser bundle.

const STORAGE_KEY = 'pixelscry-collection';

function loadInitial() {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

let ownedSlugs = $state(loadInitial());

function persist() {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedSlugs));
}

export function getOwnedSlugs() {
    return ownedSlugs;
}

export function isOwned(slug) {
    return ownedSlugs.includes(slug);
}

export function toggleOwned(slug) {
    ownedSlugs = ownedSlugs.includes(slug)
        ? ownedSlugs.filter((s) => s !== slug)
        : [...ownedSlugs, slug];
    persist();
}
