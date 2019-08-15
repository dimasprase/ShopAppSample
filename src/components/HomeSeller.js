import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeItem,addQuantity,subtractQuantity, addToHistory} from './actions/cartActions'
import web3 from '../web3';
import buy from '../buy';

class HomeSeller extends Component{

    constructor(props){
        super(props);
        this.state = {
            addressCourier: '',
            acc: ''
        };
    }

    handleChange = ({ target }) => {
        this.setState({
            [target.name]: target.value
        });
     };

    async componentDidMount() {

        var defaultAccount;
        await window.ethereum.enable().then((account) =>{
            defaultAccount = account[0];
            web3.eth.defaultAccount = defaultAccount;
            this.setState({
                acc: defaultAccount
            })  
        })

        const getOrderByAddressSeller = await buy.methods.getOrderByAddressSeller().call();
        const getContractBalance = await buy.methods.getContractBalance().call();

        const orderNo = getOrderByAddressSeller[1];
        const productId = getOrderByAddressSeller[2];
        const productName = getOrderByAddressSeller[3];
        const productQuantity = getOrderByAddressSeller[4];
        const productPrice = (web3.utils.fromWei(getOrderByAddressSeller[5].toString(), 'ether') * 1);
        const phoneNumber = getOrderByAddressSeller[6];
        const location = getOrderByAddressSeller[7];
        const note = getOrderByAddressSeller[8];
        const priceCourier = (web3.utils.fromWei(getOrderByAddressSeller[10].toString(), 'ether') * 1);

        if (getOrderByAddressSeller[9] == 1) {
            const status = "Barang belum diproses oleh penjual";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressSeller[9] == 2) {
            const status = "Barang sudah diproses oleh penjual";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressSeller[9] == 3) {
            const status = "Barang sedang diantar oleh kurir";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressSeller[9] == 4) {
            const status = "Barang sudah dikirim oleh kurir";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressSeller[9] == 5) {
            const status = "Barang sudah diterima";
            this.setState({ 
                status
            });
        }
        const totalPrice = productPrice + priceCourier;
        console.log(totalPrice);

        this.setState({ 
            getOrderByAddressSeller,  
            getContractBalance,
            orderNo,
            productId,
            productName,
            productQuantity,
            location,
            phoneNumber,
            productPrice,
            note,
            priceCourier,
            totalPrice
        });

        //console.log("Contract Balance : " + getContractBalance);
        //console.log(getOrderByAddressSeller);
    }

    lacak = (id)=>{
        this.props.history.push('/tracking');        
    }
    
    kirim = async (orderNo)=>{

        Date.prototype.yyyymmdd = function() {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
          
            return [this.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd
                   ].join('-');
        };

        Date.prototype.yyyymmddTambahDua = function() {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate() + 2;
          
            return [this.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd
                   ].join('-');
        };

        var datePickUp = new Date().yyyymmdd();
        var dateDelivery = new Date().yyyymmddTambahDua();

        var trackingNo = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < 10; i++ ) {
            trackingNo += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        var defaultAccount;
        await window.ethereum.enable().then((account) =>{
            defaultAccount = account[0];
            web3.eth.defaultAccount = defaultAccount;
            this.setState({
                acc: defaultAccount
            })  
        })

        const addressCourier = this.state.addressCourier;

        await fetch('https://api.aftership.com/v4/trackings', {
                method: 'POST',
                headers : {
                    "aftership-api-key": "a8695ccf-ff04-4cf2-a2d7-ba55f424786d",
                    "Content-type": "application/json"
                },
                body:JSON.stringify({
                    tracking: {
                        slug: "jne",
                        tracking_number: trackingNo,
                        title: "Pembelian " + this.state.productName,
                        smses: [
                            this.state.phoneNumber
                        ],
                        emails: [
                            "email@yourdomain.com"
                        ],
                        order_id: orderNo,
                        order_id_path: "http://www.aftership.com/order_id=" + orderNo,
                        custom_fields: {
                            product_name: this.state.productName,
                            product_price: this.state.productPrice
                        },
                        language: "en",
                        order_promised_delivery_date: dateDelivery,
                        delivery_type: "pickup_at_store",
                        pickup_location: "Smart Contract Store",
                        pickup_note: "Reach out to our staffs when you arrive our stores for shipment pickup"
                    }
                })
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
            
        await buy.methods.courierSend(orderNo, datePickUp, addressCourier, trackingNo).send({
            from: this.state.acc
        });

        console.log(addressCourier);
        window.location.reload();
    }

    proses = async (orderNo)=>{

        var defaultAccount;
        await window.ethereum.enable().then((account) =>{
            defaultAccount = account[0];
            web3.eth.defaultAccount = defaultAccount;
            this.setState({
                acc: defaultAccount
            })  
        })

        let newDate = new Date();
        let date = newDate.getDate();
        let month = newDate.getMonth();
        let year = newDate.getFullYear();
        let hour = newDate.getHours();
        let second = newDate.getSeconds();
        let milisecond = newDate.getMilliseconds();
       
        const invoiceNo = date + "" + month + "" + year + "" + hour + "" + second + "" + milisecond;

        await buy.methods.sellerProcess(orderNo, invoiceNo).send({
            from: this.state.acc
        });

        window.location.reload();
    }

    renderElement(){
        if (this.state.getOrderByAddressSeller[9] == 1) {
            return  <div>
                        <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.lacak(this.state.orderNo)}}>Lacak Kurir</button>
                        <button className="waves-effect waves-light btn" onClick={()=>{this.proses(this.state.orderNo)}}>Proses</button>
                    </div>;
        } else if (this.state.getOrderByAddressSeller[9] == 2) {
            return  <div>
                        <p>
                            <br/>
                            Address Kurir
                            <input type="text" name="addressCourier" value={this.state.addressCourier} onChange={this.handleChange}/>
                        </p>
                        <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.lacak(this.state.orderNo)}}>Lacak Kurir</button>
                        <button className="waves-effect waves-light btn" onClick={()=>{this.kirim(this.state.orderNo)}}>Kirim</button>
                    </div>;
        } else {
            return  <div>
                        <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.lacak(this.state.orderNo)}}>Lacak Kurir</button>
                    </div>;
        }
        return null;
     }

    render(){

        var i;
        var itemss = [];
        
        for (i = 0; i < this.props.items.length; i++) { 
            
            if (this.props.items[i].id == this.state.productId) {
                itemss.push({
                    id: this.props.items[i].id,
                    img: this.props.items[i].img,
                    title: this.props.items[i].title
                });
            }
        }

        let addedItems = itemss.length ?
            (  
                itemss.map( item=>  {
                    return(
                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img"> 
                                <img src={item.img} alt={item.img} className=""/>
                            </div>
                                
                            <div className="item-desc">
                                <span className="title">{this.state.productName}</span>
                                <p>{item.desc}</p>
                                <p><b>Harga: {this.state.productPrice} ETH</b></p> 
                                <p>
                                    <b>Jumlah: {this.state.productQuantity}</b> 
                                </p>
                                <div className="add-remove">
                                    <label>
                                        <span>Kurir(+{this.state.priceCourier} ETH)</span>
                                    </label>
                                </div>

                                <p>
                                    <b>Total: {this.state.totalPrice} ETH</b>
                                </p>
                                <p>
                                    <b>Status: {this.state.status}</b>
                                </p>
                                <p>
                                <br/>
                                Alamat
                                <input type="text" name="address" defaultValue={this.state.location} onChange={this.handleChange} disabled/>
                                </p>

                                <p>
                                <br/>
                                Nomor Telepon
                                <input type="number" name="phonenumber" defaultValue={this.state.phoneNumber} onChange={this.handleChange} disabled/>
                                </p>

                                <p>
                                <br/>
                                Catatan
                                <input type="text" name="note" defaultValue={this.state.note} onChange={this.handleChange} disabled/>
                                </p>
                                
                                { this.renderElement() }
                            </div>        
                        </li> 
                    )
                })
            ):

             (
                <p>Nothing.</p>
             )
       return(
            <div className="container">
                <div className="cart">
                    <h5>Riwayat Belanja:</h5>
                    <ul className="collection">
                        {addedItems}
                    </ul>
                </div>          
            </div>
       )
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
export default connect(mapStateToProps,mapDispatchToProps)(HomeSeller)