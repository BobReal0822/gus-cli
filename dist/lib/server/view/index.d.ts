export interface IPropsInfo {
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
export interface IStateInfo {
    size: string;
}
