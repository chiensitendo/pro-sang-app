const count = 10;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

export const fetchFakeLyricList = () => {
    return fetch(fakeDataUrl).then(res => res.json());
}

export const fetchFakeCommandList = () => {
    return fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
        .then(res => res.json());
}

export const fetchFakeLyricContent = (ref: string) => {
    return fetch('/api/lyric/save')
        .then(res => res.json());
}