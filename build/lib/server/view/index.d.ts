export interface PropsInfo {
    app: {
        name: string;
        type: string;
    };
    data: any;
    location: string;
    context: {
        url?: string;
    } | undefined;
}
export interface StateInfo {
    size: string;
}
