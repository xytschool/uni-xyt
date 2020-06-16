import {get ,post} from '../utils/request'
const host = "/v1/order"
//const host = "http://order.ideatest.top:8883/v1/order"
//const host = "http://localhost:8883/v1/order"
module.exports = {
    async  getTicketByCode(code){
        return get(host + '/getTicketByCode', {code})
    },
    async getOrderByTicketID(ticketId){
        return get('/getTicket/' + ticketId)
    }
}
