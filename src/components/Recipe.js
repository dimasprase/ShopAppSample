import React, { Component } from 'react'
import { connect } from 'react-redux'
//import { addShipping } from './actions/cartActions'
class Recipe extends Component{
    
    componentWillUnmount() {
         if(this.refs.shipping.checked)
              this.props.substractShipping()
    }

    handleChecked = (e)=>{
        if(e.target.checked){
            this.props.addShipping();
        }
        else{
            this.props.substractShipping();
        }
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

    render(){
  
        return(
            <div className="container">
                <div className="collection">
                    <li className="collection-item">
                        <label>
                            <input type="checkbox" ref="shipping" onChange= {this.handleChecked} />
                            <span>Shipping(+6$)</span>
                        </label>
                    </li>
                    <li className="collection-item"><b>Total: {this.props.total} $</b></li>
                    <li className="collection-item"><textarea rows="4" cols="50" name="comment" form="usrform" defaultValue="This is a description."></textarea></li>
                </div>
                <div className="checkout">
                    <button className="waves-effect waves-light btn" onClick={()=>{this.check(this.props.total)}}>Checkout</button>
                </div>
                 </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        addedItems: state.addedItems,
        total: state.total
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        addShipping: ()=>{dispatch({type: 'ADD_SHIPPING'})},
        substractShipping: ()=>{dispatch({type: 'SUB_SHIPPING'})}
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Recipe)
