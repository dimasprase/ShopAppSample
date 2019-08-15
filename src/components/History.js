import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeItem,addQuantity,subtractQuantity, addToHistory} from './actions/cartActions'
import web3 from '../web3';
import buy from '../buy';

class History extends Component{

    constructor(props){
        super(props);
        this.state = {
            acc: ''
        };
    }

    async componentDidMount() {

        var defaultAccount;
        await window.ethereum.enable().then((account) =>{
            defaultAccount = account[0];
            web3.eth.defaultAccount = defaultAccount;
            this.setState({
                acc: defaultAccount
            })  
        })

        const getOrderByAddressBuyer = await buy.methods.getOrderByAddressBuyer(this.state.acc).call();
        const getContractBalance = await buy.methods.getContractBalance().call();

        const orderNo = getOrderByAddressBuyer[1];
        const productId = getOrderByAddressBuyer[2];
        const productName = getOrderByAddressBuyer[3];
        const productQuantity = getOrderByAddressBuyer[4];
        const productPrice = (web3.utils.fromWei(getOrderByAddressBuyer[5].toString(), 'ether') * 1);
        const phoneNumber = getOrderByAddressBuyer[6];
        const location = getOrderByAddressBuyer[7];
        const note = getOrderByAddressBuyer[8];
        const priceCourier = (web3.utils.fromWei(getOrderByAddressBuyer[10].toString(), 'ether') * 1);

        if (getOrderByAddressBuyer[9] == 1) {
            const status = "Barang belum diproses oleh penjual";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressBuyer[9] == 2) {
            const status = "Barang sudah diproses oleh penjual";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressBuyer[9] == 3) {
            const status = "Barang sedang diantar oleh kurir";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressBuyer[9] == 4) {
            const status = "Barang sudah dikirim oleh kurir";
            this.setState({ 
                status
            });
        } else if (getOrderByAddressBuyer[9] == 5) {
            const status = "Barang sudah diterima";
            this.setState({ 
                status
            });
        }
        const totalPrice = productPrice + priceCourier;
        console.log(totalPrice);

        this.setState({ 
            getOrderByAddressBuyer,  
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

        console.log("Contract Balance : " + getContractBalance);
        console.log(getOrderByAddressBuyer);
    }

    lacak = (id)=>{
        this.props.history.push('/tracking');        
    }

   check = (total)=>{
       let newDate = new Date()
       let date = newDate.getDate();
       let month = newDate.getMonth();
       let year = newDate.getFullYear();
       let hour = newDate.getHours();
       let second = newDate.getSeconds();
       let milisecond = newDate.getMilliseconds();
       
       console.log(date + "" + month + "" + year + "" + hour + "" + second + "" + milisecond);
   }
    
    handleClick = (id)=>{
        this.props.addToHistory(id)
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

                                <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.lacak(item.id)}}>Lacak Kurir</button>
                                
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
export default connect(mapStateToProps,mapDispatchToProps)(History)