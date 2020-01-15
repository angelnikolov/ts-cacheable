export interface ICachePair<T> {
    parameters: any;
    response: T;
    created: Date;
}
