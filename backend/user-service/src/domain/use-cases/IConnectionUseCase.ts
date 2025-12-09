export interface IGetConnections {
    getUnconnectedUsers (id:string): Promise<any>
}

export interface IAlterConnectionRequest {
    alterConnectionRequest (user:string, id:string, action:string): Promise<{success:boolean}>
}

export interface IGetUserRequests {
    getUserRequests (id:string): Promise<any>
}

export interface IEvaluateRequest {
    evaluateRequest (user:string, id:string, action:string): Promise<{success:boolean}>
}