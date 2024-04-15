import {Client} from "@stomp/stompjs";

export class LesStomp {
     client:any;
     brokerURL:any;
     destination:string;
     subId:string;
     connectHeaders:{
         login:string,
         passcode:string
     }
     reconnectDelay:number
     heartbeatIncoming:number
     heartbeatOutgoing:number
     onSubscribeCallBack?:Function
     stateCallBack?:Function
    constructor(options:any) {
        this.client = null
        this.brokerURL = options.url
        this.destination = "/exchange/" + options.channel || "/exchange/IP.topic/All.IP.BROADCAST.*"
        this.subId = options.subId || "lesSubId"
        this.connectHeaders = {
            login: options.username || "admin",
            passcode: options.password || "admin"
        }
        this.reconnectDelay = options.reconnectDelay || 5000
        this.heartbeatIncoming = options.heartbeatIncoming || 50000
        this.heartbeatOutgoing = options.heartbeatOutgoing || 50000
        this.onSubscribeCallBack = options.onSubscribeCallBack
        this.stateCallBack = options.stateCallBack
        this.connect()
    }

    connect() {
        this.client = new Client({
            brokerURL: this.brokerURL,
            connectHeaders: this.connectHeaders,
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: this.heartbeatIncoming,
            heartbeatOutgoing: this.heartbeatOutgoing,
            debug: function (str) {
                // console.log("stomp debug",str);
            },
            onWebSocketClose: function () {
                console.log('::::::onWebSocketClose::::::');
            }
        })
        this.client.onConnect = (frame:any) => {
            // console.log('Broker onConnect: ' + frame.headers);
            //console.log('onConnect body: ' + frame.body);
            if (typeof this.stateCallBack == "function") {
                this.stateCallBack(frame)
            }
            this.subscribe()
        }
        this.client.onStompError = (frame:any) => {
            if (typeof this.stateCallBack == "function") {
                this.stateCallBack(frame)
            }
        }
        this.client.activate()
    }

    subscribe() {
        this.client.subscribe(this.destination, (message:any) => {
            // console.log("subscribe message",message)
            if (typeof this.onSubscribeCallBack == "function") {
                this.onSubscribeCallBack(message.body)
            }
        }, {id: this.subId});
    }

    /*取消订阅*/
    unsubscribe() {
        this.client.unsubscribe(this.subId)
    }

    /*断开链接*/
    deactivate() {
        this.client.deactivate()
    }

}

