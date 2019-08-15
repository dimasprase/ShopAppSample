pragma solidity ^0.4.25;

contract Payment {

    uint totalPrice;
    address public shop;
    address public sellerAddress;

    struct Shipment {
        address courier;
        uint priceCourier;
        address buyer;
        string date;
        string deliveryDate;

        bool init;
    }

    struct Order {
        uint orderNo;
        uint productId;
        string productName;
        uint productQuantity;
        uint productPrice;
        uint shipmentPrice;
        string phoneNumber;
        string location;
        string note;
        uint status;
        uint trackingNo;
        //mapping (address => Buyer) buyer;
        Shipment shipment;
        Buyer buyer;

        bool init;
    }
    
    struct Buyer {
        address addr;

        bool init;
    }

    struct Invoice {
        uint orderNo;
        uint invoiceNo;

        bool init;
    }

    mapping (uint => Order) ordersByOrderNumber;
    mapping (address => Order) ordersByAddress;
    Order ordersBySeller;

    mapping (uint => Invoice) invoices;

    function Payment(address _sellerAddress) public payable {
        shop = msg.sender;
        sellerAddress = _sellerAddress;
    }

    function sendOrder(uint orderNo, uint productId, string productName, uint productQuantity, uint productPrice, uint shipmentPrice, string phoneNumber, string location, string note) public payable {
        totalPrice = productPrice + shipmentPrice;
        require(msg.value == totalPrice);
        
        ordersByOrderNumber[orderNo] = Order(orderNo, productId, productName, productQuantity, productPrice, shipmentPrice, phoneNumber, location, note, 1, 0, Shipment(0, shipmentPrice, msg.sender, "", "", true), Buyer(msg.sender, true), true);
        ordersByAddress[msg.sender] = Order(orderNo, productId, productName, productQuantity, productPrice, shipmentPrice, phoneNumber, location, note, 1, 0, Shipment(0, shipmentPrice, msg.sender, "", "", true), Buyer(msg.sender, true), true);
        ordersBySeller = Order(orderNo, productId, productName, productQuantity, productPrice, shipmentPrice, phoneNumber, location, note, 1, 0, Shipment(0, shipmentPrice, msg.sender, "", "", true), Buyer(msg.sender, true), true);
    }

    
    function getOrderByOrderNo(uint orderNo) constant public returns (address, uint, uint, string, uint, uint, string, string, string, uint, uint) {
        Order memory orderStruct;
        orderStruct = ordersByOrderNumber[orderNo];

        return(orderStruct.buyer.addr, orderStruct.orderNo, orderStruct.productId, orderStruct.productName, orderStruct.productQuantity, orderStruct.productPrice, orderStruct.phoneNumber, orderStruct.location, orderStruct.note, orderStruct.status, orderStruct.shipment.priceCourier);
    }
    
    function getOrderByTracking() constant public returns (uint, uint, uint) {
        Order memory orderStruct;
        orderStruct = ordersBySeller;

        Invoice storage _invoice = invoices[orderStruct.orderNo];
        
        return(orderStruct.trackingNo, _invoice.invoiceNo, _invoice.orderNo);
    }
    
    function getOrderByAddressBuyer(address buyerAddress) constant public returns (address, uint, uint, string, uint, uint, string, string, string, uint, uint) {
        Order memory orderStruct;
        orderStruct = ordersByAddress[buyerAddress];
        
        require(buyerAddress == orderStruct.buyer.addr);

        return(orderStruct.buyer.addr, orderStruct.orderNo, orderStruct.productId, orderStruct.productName, orderStruct.productQuantity, orderStruct.productPrice, orderStruct.phoneNumber, orderStruct.location, orderStruct.note, orderStruct.status, orderStruct.shipment.priceCourier);
    }
    
    function getOrderByAddressSeller() constant public returns (address, uint, uint, string, uint, uint, string, string, string, uint, uint) {
        Order memory orderStruct;
        orderStruct = ordersBySeller;

        return(orderStruct.buyer.addr, orderStruct.orderNo, orderStruct.productId, orderStruct.productName, orderStruct.productQuantity, orderStruct.productPrice, orderStruct.phoneNumber, orderStruct.location, orderStruct.note, orderStruct.status, orderStruct.shipment.priceCourier);
    }
    
    function sellerProcess(uint orderNo, uint invoiceNo) payable public {
        require(ordersByOrderNumber[orderNo].init);
        require(ordersByAddress[ordersByOrderNumber[orderNo].buyer.addr].init);
        
        require(sellerAddress == msg.sender);

        invoices[orderNo] = Invoice(orderNo, invoiceNo, true);
        
        ordersByOrderNumber[orderNo].status = 2;
        ordersByAddress[ordersByOrderNumber[orderNo].buyer.addr].status = 2;
        ordersBySeller.status = 2;
    }
    
    function courierSend(uint orderNo, string date, address courier, uint trackingNumber) payable public {
        require(sellerAddress == msg.sender);

        ordersByOrderNumber[orderNo].shipment.courier = courier;
        ordersByAddress[ordersByOrderNumber[orderNo].buyer.addr].shipment.courier = courier;
        ordersBySeller.shipment.courier = courier;
        
        ordersByOrderNumber[orderNo].shipment.date = date;
        ordersByAddress[ordersByOrderNumber[orderNo].buyer.addr].shipment.date = date;
        ordersBySeller.shipment.date = date;
        
        ordersByOrderNumber[orderNo].status = 3;
        ordersByAddress[ordersByOrderNumber[orderNo].buyer.addr].status = 3;
        ordersBySeller.status = 3;
        
        ordersByOrderNumber[orderNo].trackingNo = trackingNumber;
        ordersByAddress[ordersByOrderNumber[orderNo].buyer.addr].trackingNo = trackingNumber;
        ordersBySeller.trackingNo = trackingNumber;
    }

    function getInvoiceByOrderNo(uint orderNo) constant public returns (address, uint, uint, string, string, address) {
        Invoice storage _invoice = invoices[orderNo];
        Order storage _order     = ordersByOrderNumber[_invoice.orderNo];

        return (_order.buyer.addr, _order.orderNo, _invoice.invoiceNo, _order.shipment.date, _order.shipment.deliveryDate, _order.shipment.courier);
    }

    function delivery(uint orderNo, string deliveryDate) payable public {
        require(invoices[orderNo].init);

        Invoice storage _invoice = invoices[orderNo];
        Order storage _order     = ordersByOrderNumber[_invoice.orderNo];

        require(_order.shipment.courier == msg.sender);

        sellerAddress.transfer(_order.productPrice);

        _order.shipment.courier.transfer(_order.shipment.priceCourier);

        ordersByOrderNumber[_invoice.orderNo].status = 4;
        ordersByAddress[ordersByOrderNumber[_invoice.orderNo].buyer.addr].status = 4;
        ordersBySeller.status = 4;
        
        ordersByOrderNumber[_invoice.orderNo].shipment.deliveryDate = deliveryDate;
        ordersByAddress[ordersByOrderNumber[_invoice.orderNo].buyer.addr].shipment.deliveryDate = deliveryDate;
        ordersBySeller.shipment.deliveryDate = deliveryDate;
    }
    
    function getAddressCourier(uint orderNo) constant public returns (address) {
        require(invoices[orderNo].init);

        Invoice storage _invoice = invoices[orderNo];
        Order storage _order     = ordersByOrderNumber[_invoice.orderNo];

        return _order.shipment.courier;

        
    }
    
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    function getRefund(uint orderNo) public {
        Order storage _order = ordersByOrderNumber[orderNo];
        require(msg.sender == _order.buyer.addr);
        _order.buyer.addr.transfer(_order.productPrice + _order.shipment.priceCourier);
        
        delete ordersByOrderNumber[orderNo];
        delete ordersByAddress[msg.sender];
        delete ordersBySeller;
        delete invoices[orderNo];
    }
}