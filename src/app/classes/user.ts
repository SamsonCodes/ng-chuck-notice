export class User {
    constructor(
        public _id: string,
        public name: string,
        public password: string,
        public userGroup: string,
        public penalties: number
    ){}
}