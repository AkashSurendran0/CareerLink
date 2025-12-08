export class Connections {
    constructor (
        public id:string,
        public user:string,
        public connections:string[],
        public pendings:string[]
    ) {}
}