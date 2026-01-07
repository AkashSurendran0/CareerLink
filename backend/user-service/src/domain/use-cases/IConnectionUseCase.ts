export type SimpleUser = { id: string; name?: string; dp?: string | null; pending?: boolean };

export type UsersWithCount = { users: SimpleUser[]; requestCount: number };

export interface IGetConnections {
    getUnconnectedUsers(id: string, name: string | undefined): Promise<UsersWithCount>
}

export interface IAlterConnectionRequest {
    alterConnectionRequest(user: string, id: string, action: string): Promise<{ success: boolean }>
}

export interface IGetUserRequests {
    getUserRequests(id: string, name: string | undefined): Promise<UsersWithCount>
}

export interface IEvaluateRequest {
    evaluateRequest(user: string, id: string, action: string): Promise<{ success: boolean }>
}

export interface IGetConnectedUsers {
    getConnectedUsers(id: string, name: string | undefined): Promise<UsersWithCount>
}

export interface IRemoveConnection {
    removeConnection(id: string, user: string): Promise<{ success: boolean }>
}

export interface IGetConnectionDetails {
    getConnectionDetails(id: string, user: string): Promise<{ connection: string }>
}