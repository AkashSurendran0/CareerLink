export class Features {
    constructor(
        public text:string,
        public code:string
    ) {}
}

export class SubscriptionType {
    constructor(
        public _id:string,
        public name:string,
        public amount:number,
        public billingCycle:number,
        public features:Features[],
        public active:boolean
    ) {}
}