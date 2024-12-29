export interface Res<T> {
    readonly code: number
    readonly data: null | T
    readonly msg: string
}
