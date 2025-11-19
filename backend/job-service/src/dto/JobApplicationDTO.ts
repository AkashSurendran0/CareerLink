export interface JobApplicationDto{
    _id:string,
    jobPost:string,
    applicants:[{
        _id:string,
        user:string,
        resume:string,
        coverLetter:string,
        status:string,
        createdAt:Date
    }]
}