export declare const config: () => {
    module: {
        loaders: ({
            test: RegExp;
            loader: string;
        } | {
            test: RegExp;
            loader: string;
            query: {
                mimetype: string;
            };
        })[];
    };
    plugins: never[];
    resolve: {
        extensions: string[];
        alias: {
            moment$: string;
        };
    };
};
