const accountSid = "ACe9fe26913114425f8d11996450c696c1";
const authToken = "9f81159fff768d230594a9100bfb3f94";
const client = require('twilio')(accountSid, authToken);


//This code under construction
export class MobileService{
    constructor(to:string){
        this.to = to;
    }

    async send():Promise<number>{
        client.messages.create({
            body: this.body,
            from: this.from,
            to: this.to
        })
        .then((message: { sid: any; }) => console.log(message.sid));
        return 200;
    }

    private from = "+16593006193";
    private to = "";
    private body = "Hello from Plazer";
}