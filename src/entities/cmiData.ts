export class CMIData {
    name: string;
    values: value[];

    constructor() {
        this.values = [];
    }
}

interface value {
    description: string;
    value: number;
    unit: string;
}