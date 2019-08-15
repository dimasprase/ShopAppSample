import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeItem,addQuantity,subtractQuantity, addToHistory} from './actions/cartActions'
import web3 from '../web3';
import buy from '../buy';

class Delivered extends Component{

    constructor(props){
        super(props);
        this.state = { 
            trackings: {},
            acc: '',
            invoiceNo: '',
            orderNo: ''
        };
    }

    async componentDidMount() {

        var defaultAccount;
        window.ethereum.enable().then((account) =>{
            defaultAccount = account[0];
            web3.eth.defaultAccount = defaultAccount;
            this.setState({
                acc: defaultAccount
            })  
        })

        const getTrackingNo = await buy.methods.getOrderByTracking().call();

        await fetch('https://api.aftership.com/v4/trackings/jne/' + getTrackingNo[0], {
                method: 'GET',
                headers : {
                    "aftership-api-key": "9b70ada3-881d-44ab-9120-1306d38edf47",
                    "Content-type": "application/json"
                }
            }).then((res) => res.json())
            .then((response) =>  {
                this.setState({
                    trackings: response.data.tracking
                })
                console.log("Trc num : " + this.state.trackings.tracking_number)
            })
            .catch((err)=>console.log(err))
            
            this.setState({
                invoiceNo: getTrackingNo[1],
                orderNo: getTrackingNo[2]
            })
        
        console.log(getTrackingNo[0] + " " + this.state.invoiceNo)
    }

    confirm = async (orderNo)=>{
        Date.prototype.yyyymmdd = function() {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
          
            return [this.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd
                   ].join('-');
        };

        var dateDelivered = new Date().yyyymmdd();

        await buy.methods.delivery(this.state.orderNo, dateDelivered).send({
            from: this.state.acc
        });

        this.props.history.push('/buyer/history');
    }

    render(){

        if (this.state.trackings != null) {
            let addedItems =
            (               
                <div className="item-desc">
                    <br/>
                    <p><b>Nomor Tracking : {this.state.trackings.tracking_number}</b></p> 
                    <p><b>ID Tracking: {this.state.trackings.id}</b></p>
                    <p><b>Kurir: {this.state.trackings.slug}</b></p>
                    <p><b>Order Id: {this.state.trackings.order_id}</b></p>
                    <p><b>Status: {this.state.trackings.tag}</b></p>

                    <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.confirm(this.state.orderNo)}}>Konfirmasi Pengiriman</button>
                </div>
            )
       return(
            <div className="container">
                <div className="cart">
                    <h5>Tracking :</h5>
                    <ul>
                        {addedItems}
                    </ul>
                </div>          
            </div>
       )
        } else {
            let addedItems =
            (               
                <div className="item-desc">
                    <br/>
                    <p><b>Nomor Tracking : -</b></p> 
                    <p><b>ID Tracking: -</b></p>
                    <p><b>Kurir: -</b></p>
                    <p><b>Order Id: -</b></p>
                    <p><b>Status: -</b></p>
                </div>
            )
       return(
            <div className="container">
                <div className="cart">
                    <h5>Tracking :</h5>
                    <ul>
                        {addedItems}
                    </ul>
                </div>          
            </div>
       )
        }
    }
}


const mapStateToProps = (state)=>{
    return{
        items: state.items,
        addedItems: state.addedItems
    }
}
const mapDispatchToProps = (dispatch)=>{
    return{
        addShipping: ()=>{dispatch({type: 'ADD_SHIPPING'})},
        substractShipping: ()=>{dispatch({type: 'SUB_SHIPPING'})},
        removeItem: (id)=>{dispatch(removeItem(id))},
        addQuantity: (id)=>{dispatch(addQuantity(id))},
        subtractQuantity: (id)=>{dispatch(subtractQuantity(id))},
        addToHistory: (id)=>{dispatch(addToHistory(id))}
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Delivered)