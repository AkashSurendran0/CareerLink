export function getNthDay (n:number) {
    const today=new Date();
    today.setDate(today.getDate() + n);
    return today;
}