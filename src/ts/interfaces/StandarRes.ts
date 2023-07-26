export default interface StandardRes {
    status: string;
    message: string;
    data: Array<any> | object | null;
}
