export const UPPER_CASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
export const NUMBERS = '0123456789';
export const NUMBERS_HEX = '0123456789abcdef';

export function rand(start = 1, end = undefined) {
    let a = start;
    let b = end;
    if (end === undefined) {
        b = start;
        a = 0;
    }
    return Math.random() * (b - a) + a;
}

// return [start, end -1]
export function randi(start = 2, end = undefined) {
    let a = start;
    let b = end;
    if (end === undefined) {
        b = start;
        a = 0;
    }
    return Math.floor(Math.random() * (b - a)) + a;
}

export function randExp(start, end) {
    const a = Math.log(start);
    const b = Math.log(end);
    return Math.exp(rand(a, b));
}

export function randLog(start, end) {
    const a = Math.exp(start);
    const b = Math.exp(end);
    return Math.log(rand(a, b));
}

export function randDate(start, end) {
    return new Date(randi(start.getTime(), end.getTime()));
}

export function choose(size, letters) {
    const chars = [];
    for (let i = 0; i < size; i++) {
        const { length } = letters;
        let index = Math.floor(Math.random() * length);
        index %= length;
        chars.push(letters[index]);
    }
    return chars.join('');
}

export function choose10(size) {
    return choose(size, NUMBERS);
}

export function choose16(size) {
    return choose(size, NUMBERS_HEX);
}

export function choose26(size) {
    return choose(size, LOWER_CASE_LETTERS);
}

export function choose36(size) {
    return choose(size, 'abcdefghijklmnopqrstuvwxyz0123456789');
}

export function choose52(size) {
    return choose(size, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
}

export function choose62(size) {
    return choose(
        size,
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    );
}

export function choose72(size) {
    return choose(
        size,
        'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    );
}
