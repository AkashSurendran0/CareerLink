
export interface IResumeRepository{
    addResume (url:string, user:string) : Promise<{success:boolean}>
}