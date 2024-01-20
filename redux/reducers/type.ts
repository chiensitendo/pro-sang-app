export class CustomMap {
    buckets: any = {};
    count: number = 0;
    constructor() {

    }

    getKey(key: any): string {
        return key + '';
    }

    put(key: any, value: any) {
        this.buckets[this.getKey(key)] = value;
        this.count++;
    }
    clear() {
        this.buckets = {};
        this.count = 0;
    }

    isEmpty(): boolean {
        
        return this.count === 0;
    }

    getValue(key: any) {
        if (this.has(key)) {
            return this.buckets[this.getKey(key)];
        }

        return undefined;
    }

    has(key: any): boolean {
        if (this.buckets[this.getKey(key)]) {
            return true;
        } else {
            return false;
        }
    }
    remove(key: any) {
        if (this.has(key)) {
            delete this.buckets[this.getKey(key)];
            this.count--;
        }
    }

    getItems(): any[] {
        if (this.count <= 0) return [];

        return Object.keys(this.buckets).map(k => this.buckets[k]);
    }

    getCount(): number {
        return this.count;
    }
}

