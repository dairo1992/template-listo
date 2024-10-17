export interface Routes {
    items: Item[];
    label: string;
}

export interface Item {
    icon: string;
    label: string;
    routerLink: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRoutes(json: string): Array<Routes[]> {
        return JSON.parse(json);
    }

    public static routesToJson(value: Array<Routes[]>): string {
        return JSON.stringify(value);
    }
}
