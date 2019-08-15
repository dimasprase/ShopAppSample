import React, { Component } from 'react';
import { connect } from 'react-redux'
import { addToCart } from './actions/cartActions'
import { Link } from 'react-router-dom'
import web3 from '../web3';
import buy from '../buy';

 class Home extends Component{
    
    state = {
        sellerAddress: '', 
        shop: ''
    };
    

    async componentDidMount() {

        const sellerAddress = await buy.methods.sellerAddress().call();
        const shop = await buy.methods.shop().call();

        this.setState({ 
            sellerAddress,  
            shop
        });
    }

    handleClick = (id)=>{
        this.props.addToCart(id); 
    }

    render() {
        
        let itemList = this.props.items.map(item=>{
            return(
                <div className="card" key={item.id}>
                        <div className="card-image">
                            <img src={item.img} alt={item.title}/>
                            <span className="card-title">{item.title}</span>
                            <Link to="/buyer/cart" className="btn-floating halfway-fab waves-effect waves-light red" onClick={()=>{this.handleClick(item.id)}}><i className="material-icons">add</i></Link>
                        </div>

                        <div className="card-content">
                            <p>{item.desc}</p>
                            <p><b>Harga: {item.price} ETH</b></p>
                        </div>
                 </div>

            )
        })

        return(
            <div className="container">
                <div className="box">
                    {itemList}
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
      items: state.items
    }
  }
const mapDispatchToProps= (dispatch)=>{
    
    return{
        addToCart: (id)=>{dispatch(addToCart(id))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Home)