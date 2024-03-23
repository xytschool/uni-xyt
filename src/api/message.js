import {get, post, ws} from '../utils/request'
import {getAuthToken, getClientID} from '../utils/utils'
import {baseUrl} from '../config'
//const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = baseUrl + "/site"
const wsHost = "ws://127.0.0.1:8890/dev/message/14/newClient"

function newPongEvent() {
    return {
        event_id: '',
        event_name: 'pong',
        source: getClientID(),
        created_at: new Date().getTime() / 1000
    }
}

var wsClient = null

function createdClient() {
    var token = getAuthToken()
    return ws(wsHost + "?token=" + token)
}

function initWsClient() {
    if (wsClient != null) {
        return
    }

    wsClient = createdClient()
    wsClient.onClose(() => {
        wsClient = null
        setTimeout(() => {
            wsClient = createdClient()
        }, 2000)
    })

    wsClient.onError(() => {
        wsClient = null
        setTimeout(() => {
            wsClient = createdClient()
        }, 2000)
    })

    wsClient.onOpen(() => {
        console.log("connect server success")
    })
    wsClient.onMessage((msg) => {
        console.log('msg', msg.data)
        var pongEvent = newPongEvent()
        wsClient.send({
            data: pongEvent.event_name + '#' + JSON.stringify(pongEvent),
            fail: () => {
                console.log('发送失败')
            }
        })
    })
}

module.exports = {
    async newWsClient(params) {
        initWsClient()
    },

}
