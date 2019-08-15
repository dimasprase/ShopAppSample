import web3 from "./web3";

const address = "0x305000FE623fC9e7C0D84F3ae81fD9bdaA10C233";

const abi = [
  {
    constant: true,
    inputs: [{ name: "orderNo", type: "uint256" }],
    name: "getAddressCourier",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "shop",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "orderNo", type: "uint256" },
      { name: "invoiceNo", type: "uint256" }
    ],
    name: "sellerProcess",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "sellerAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "orderNo", type: "uint256" }],
    name: "getInvoiceByOrderNo",
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "address" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "orderNo", type: "uint256" }],
    name: "getOrderByOrderNo",
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getContractBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "buyerAddress", type: "address" }],
    name: "getOrderByAddressBuyer",
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getOrderByAddressSeller",
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "string" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getOrderByTracking",
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "orderNo", type: "uint256" },
      { name: "date", type: "string" },
      { name: "courier", type: "address" },
      { name: "trackingNumber", type: "uint256" }
    ],
    name: "courierSend",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "orderNo", type: "uint256" },
      { name: "deliveryDate", type: "string" }
    ],
    name: "delivery",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "orderNo", type: "uint256" },
      { name: "productId", type: "uint256" },
      { name: "productName", type: "string" },
      { name: "productQuantity", type: "uint256" },
      { name: "productPrice", type: "uint256" },
      { name: "shipmentPrice", type: "uint256" },
      { name: "phoneNumber", type: "string" },
      { name: "location", type: "string" },
      { name: "note", type: "string" }
    ],
    name: "sendOrder",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "orderNo", type: "uint256" }],
    name: "getRefund",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "_sellerAddress", type: "address" }],
    payable: true,
    stateMutability: "payable",
    type: "constructor"
  }
];

export default new web3.eth.Contract(abi, address);
