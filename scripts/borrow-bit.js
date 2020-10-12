/*
Bai toan cho dia chi 133.17.0.0
muon 4 bits tu host ID de chia subnet
- Co bao nhieu subnet? Liet ke?
*/

import * as func from './index'


const subnetNumber = func.getNumberOfChildSubnetsWhenBorrowFromNet(4)
console.log(subnetNumber)