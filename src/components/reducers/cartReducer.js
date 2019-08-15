import Item1 from '../../images/item1.jpg'
import Item2 from '../../images/item2.jpg'
import { ADD_TO_CART,REMOVE_ITEM,SUB_QUANTITY,ADD_QUANTITY,ADD_SHIPPING, ADD_TO_HISTORY } from '../actions/action-types/cart-actions'


const initState = {
    items: [
        {id:1,title:'Adidas asli', desc: "Ini adidas asli dijamin ga rugi", price:0.5,img:Item1},
        {id:2,title:'Nike KW', desc: "Dijual Nike KW Super, tidak beda jauh dengan yang aslinya", price: 0.2,img:Item2}
    ],
    addedItems:[],
    addedItemsHistory:[],
    total: 0,
    totalHistory: 0

}
const cartReducer= (state = initState,action)=>{
   
    //INSIDE HOME COMPONENT
    if(action.type === ADD_TO_CART){
          let addedItem = state.items.find(item=> item.id === action.id)
          //check if the action id exists in the addedItems
         let existed_item= state.addedItems.find(item=> action.id === item.id)
         if(existed_item) {
            addedItem.quantity += 1 
            return{
                ...state,
                 total: state.total + addedItem.price 
            }
        } else {
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.price 
            
            return{
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal
            }
            
        }
    }

    //INSIDE HOME COMPONENT
    if(action.type === ADD_TO_HISTORY){
        let addedItemHistory = state.addedItems.find(item=> item.id === action.id)
        //check if the action id exists in the addedItemsHistory
        let existed_item= state.addedItemsHistory.find(item=> action.id === item.id)

        let itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )
        console.log(itemToRemove)

        if(existed_item) {
            addedItemHistory.quantity += 1 
            return{
                ...state,
                totalHistory: state.totaltotalHistory + addedItemHistory.price,
                addedItems: new_items,
                total: newTotal
            }
        } else {
            addedItemHistory.quantity = 1;
            //calculating the total
            let newTotalHisroty = state.totalHistory + addedItemHistory.price 
          
            return{
                ...state,
                addedItemsHistory: [...state.addedItemsHistory, addedItemHistory],
                totalHistory : newTotalHisroty,
                addedItems: new_items,
                total: newTotal
            }          
        }
  }

    if(action.type === REMOVE_ITEM){
        let itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)
        
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )
        console.log(itemToRemove)
        return{
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if(action.type=== ADD_QUANTITY){
        let addedItem = state.items.find(item=> item.id === action.id)
          addedItem.quantity += 1 
          let newTotal = state.total + addedItem.price
          return{
              ...state,
              total: newTotal
          }
    }
    if(action.type=== SUB_QUANTITY){  
        let addedItem = state.items.find(item=> item.id === action.id) 
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1){
            let new_items = state.addedItems.filter(item=>item.id !== action.id)
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        }
        else {
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                total: newTotal
            }
        }
        
    }

    if(action.type=== ADD_SHIPPING){
          return{
              ...state,
              total: state.total + 0.01
          }
    }

    if(action.type=== 'SUB_SHIPPING'){
        return{
            ...state,
            total: state.total - 0.01
        }
  }
    
  else{
    return state
    }
    
}

export default cartReducer
