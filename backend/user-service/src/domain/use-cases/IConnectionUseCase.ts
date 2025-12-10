export interface IGetConnections {
    getUnconnectedUsers (id:string, name:string): Promise<any>
}

export interface IAlterConnectionRequest {
    alterConnectionRequest (user:string, id:string, action:string): Promise<{success:boolean}>
}

export interface IGetUserRequests {
    getUserRequests (id:string, name:string): Promise<any>
}

export interface IEvaluateRequest {
    evaluateRequest (user:string, id:string, action:string): Promise<{success:boolean}>
}

export interface IGetConnectedUsers {
    getConnectedUsers(id:string, name:string): Promise<any>
}

export interface IRemoveConnection {
    removeConnection(id:string, user:string): Promise<{success:boolean}>
}

export interface IGetConnectionDetails {
    getConnectionDetails (id:string, user:string): Promise<{connection:string}>
}