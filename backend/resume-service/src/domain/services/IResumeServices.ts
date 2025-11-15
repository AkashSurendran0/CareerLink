export interface ICreateResume {
    createResume(data:any):Promise<any>
}

export interface IUploadResume {
    uploadResume(url:string, user:string): Promise<{success:boolean}>
}