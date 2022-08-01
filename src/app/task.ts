export class Task {
    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public deadline: string,
        public status: string,
        public create_by: string,
        public created_on: string
    ){}
}