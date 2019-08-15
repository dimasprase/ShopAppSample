import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeItem,addQuantity,subtractQuantity, addToHistory} from './actions/cartActions'
import web3 from '../web3';
import buy from '../buy';

class Cart extends Component{

    constructor(props){
        super(props);
        this.state = { 
            address: '', 
            phonenumber: '', 
            note: '',
            acc: ''
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
    }
     
    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    }; 

    //to remove the item completely
    handleRemove = (id)=>{
        this.props.removeItem(id);
    }
    //to add the quantity
    handleAddQuantity = (id)=>{
        this.props.addQuantity(id);
    }
    //to substruct from the quantity
    handleSubtractQuantity = (id)=>{
        this.props.subtractQuantity(id);
    }

   handleChecked = (e) => {
       if(e.target.checked){
           this.props.addShipping();
       }
       else{
           this.props.substractShipping();
       }
   }

    
    handleClick = async (productId, productName, price, productQuantity)=>{

        console.log(this.state.acc);
    
        const priceProd = price * productQuantity;

        const priceCouriers = 0.01;

        const decProd = (priceProd * 1);
        const decCourier = (priceCouriers * 1);

        const totalPrice = decProd + decCourier;

        let newDate = new Date();
        let date = newDate.getDate();
        let month = newDate.getMonth();
        let year = newDate.getFullYear();
        let hour = newDate.getHours();
        let second = newDate.getSeconds();
        let milisecond = newDate.getMilliseconds();
       
        const orderNo = date + "" + month + "" + year + "" + hour + "" + second + "" + milisecond;
        let productPrice = web3.utils.toWei(decProd.toString(), 'ether');
        const location = this.state.address;
        const phoneNumber = this.state.phonenumber;
        const note = this.state.note;
        const shipmentPrice = web3.utils.toWei(decCourier.toString(), 'ether');

        await buy.methods.sendOrder(orderNo, productId, productName, productQuantity, productPrice, shipmentPrice, phoneNumber, location, note).send({
            from: this.state.acc,
            value: web3.utils.toWei(totalPrice.toString(), 'ether')
        });

        this.props.removeItem(productId);
        this.props.history.push('/buyer/history');

    }

    render(){

        let addedItems = this.props.items.length ?
            (  
                this.props.items.map( item=>  {
                    return(
                        <li className="collection-item avatar" key={item.id}>
                            <div className="item-img"> 
                                <img src={item.img} alt={item.img} className=""/>
                            </div>
                                
                            <div className="item-desc">
                                <span className="title">{item.title}</span>
                                <p>{item.desc}</p>
                                <p><b>Harga: {item.price}$</b></p> 
                                <p>
                                    <b>Jumlah: {item.quantity}</b> 
                                </p>
                                <div className="add-remove">
                                    <Link to="/cart"><i className="material-icons" onClick={()=>{this.handleAddQuantity(item.id)}}>arrow_drop_up</i></Link>
                                    <Link to="/cart"><i className="material-icons" onClick={()=>{this.handleSubtractQuantity(item.id)}}>arrow_drop_down</i></Link>
                                </div>
                                <div className="add-remove">
                                    <label>
                                        <input type="checkbox" ref="shipping" onChange= {this.handleChecked} />
                                        <span>Kurir (+0.01 ETH)</span>
                                    </label>
                                </div>

                                <p>
                                    <br/>
                                    <b>Total: {this.props.total} ETH</b>
                                </p>
                                <p>
                                <br/>
                                Alamat
                                <input type="text" name="address" value={this.state.address} onChange={this.handleChange}/>
                                </p>

                                <p>
                                <br/>
                                Nomor Telepon
                                <input type="number" name="phonenumber" value={this.state.phonumber} onChange={this.handleChange}/>
                                </p>

                                <p>
                                <br/>
                                Catatan
                                <input type="text" name="note" value={this.state.note} onChange={this.handleChange}/>
                                </p>

                                <button className="waves-effect waves-light btn pink remove" onClick={()=>{this.handleRemove(item.id)}}>Batalkan</button>
                                <button className="waves-effect waves-light btn" onClick={()=>{this.handleClick(item.id, item.title, item.price, item.quantity)}}>Bayar</button>
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
                    <h5>Keranjang Belanjaan Kamu:</h5>
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
        items: state.addedItems,
        addedItems: state.addedItems,
        total: state.total
        //addedItems: state.addedItems
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
export default connect(mapStateToProps,mapDispatchToProps)(Cart)