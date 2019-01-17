export class Chat {
    constructor
      (
        public id: string,
        public message: string,
        public from: string,
        public to: string,
        public date: string
      )
    {}   
}