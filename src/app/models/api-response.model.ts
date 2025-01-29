export interface ApiResponse<T> {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: T;
}