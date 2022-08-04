export class Task {
    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public deadline: string,
        public status: string,
        public created_by: string,
        public created_on: string
    ){}
}