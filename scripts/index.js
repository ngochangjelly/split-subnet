/*
1. Xac dinh cac thong tin cua 1 dia chi IP
IP netword is devided into 2 parts net-host
- net + host = 32 bits
=> Issue: calculte how many bits for netID and how many bits for hostID
=> use subnet mask
VD: 172.29.5.128/252.255.192.0
hostip:     (1010 1100.0001 1101.00)00 0101. 1000.0000
subnetmask: (1111 1111.1111 1111.11)00 0000.0000 0000 => co 18 con so 1 => 172.29.5.128/18

hostip nhung bit tuong ung ma bit o subnet mask = 1
*/

/*
add utils function
*/
Array.prototype.forEachAsyncParallel = async function (fn) {
  await Promise.all(this.map(fn));
}
Array.prototype.forEachAsyncParallel = async function (fn) {
  await Promise.all(this.map(fn));
}
/*
end add utils function
*/

// program to convert decimal to binary
function convertToBinary(x) {
  let bin = 0;
  let rem, i = 1, step = 1;
  while (x != 0) {
    rem = x % 2;
    x = parseInt(x / 2);
    bin = bin + rem * i;
    i = i * 10;
  }
  return bin
}
function bin_to_dec(bstr) {
  return parseInt((bstr + '')
    .replace(/[^01]/gi, ''), 2);
}
function getClassFromIPAdress(address) {
  const classIndex = parseInt(address.slice(0, 3))
  if (1 <= classIndex && classIndex <= 126) {
    return 'A'
  }
  if (128 <= classIndex && classIndex <= 191) {
    return 'B'
  }
  if (192 <= classIndex && classIndex <= 223) {
    return 'C'
  }
  if (224 <= classIndex && classIndex <= 239) {
    return 'D'
  }
  if (240 <= classIndex && classIndex <= 255) {
    return 'E'
  }
}
const ipClass = [{
  key: 'A',
  numberAfterSlash: 8,
  firstBytesForNet: 1,
  addressRange: '10.0.0.0',
  networks: 11,
  totalPrivateHosts: 1677721416777214,
  defaultOctetDemonstration: '11111111.00000000.00000000.00000000',
  defaultSubnetmask: '255.0.0.0'

},
{
  key: 'B',
  numberAfterSlash: 16,
  firstBytesForNet: 2,
  addressRange: '172.16.0.0 - 172.31.0.00',
  networks: 1616,
  totalPrivateHosts: 1048544,
  defaultOctetDemonstration: '11111111.11111111.00000000.00000000',
  defaultSubnetmask: '255.255.0.0'

}, {
  key: 'C',
  numberAfterSlash: 32,
  firstBytesForNet: 3,
  addressRange: '',
  networks: 256,
  totalPrivateHosts: 65024,
  defaultOctetDemonstration: '11111111.11111111.11111111.00000000',
  defaultSubnetmask: '255.255.255.0'

}]
function getJumpStepOfSubnet(borrowBit) {
  return Math.pow(2, 8 - borrowBit)
}

const getNetAddressOfIPAddress = (ip) => {
  const splitArr = ip.split('.')
  const zeroArr = ['0', '0', '0', '0']
  const totalBitsOfIP = 4
  const firstBytesForNet = ipClass.find(i => i.key === getClassFromIPAdress(ip)).firstBytesForNet
  let res = splitArr.slice(0, firstBytesForNet).join('.')
  zeroArr.map((z, index) => {
    if (index < totalBitsOfIP - firstBytesForNet) {
      res += `.${z}`
    }
  })
  return res
}
function getHostsInTheSameNetworkOfIPAddress(ip) {
  const { numberAfterSlash } = ipClass.find(i => i.key === getClassFromIPAdress(ip))
  return `2^${numberAfterSlash} - 2`
}
function getNumberOfHostInASubnet(ip, borrowedBitsFromHost) {
  const host = ipClass.find(i => i.key === getClassFromIPAdress(ip)).numberAfterSlash
  return host - borrowedBitsFromHost
}
function getNumberOfChildSubnetsWhenBorrowFromNet(borrowedBitsFromNet) {
  return {
    asString: `2^${8 - borrowedBitsFromNet}`,
    value: Math.pow(2, 8 - borrowedBitsFromNet)
  }
}
function getNumberOfChildUsableSubnetsWhenBorrowFromNet(borrowedBitsFromNet) {
  return {
    asString: `2^${8 - borrowedBitsFromNet} - 2`,
    value: Math.pow(2, 8 - borrowedBitsFromNet) - 2
  }
}
function getBroadcastAdressOfIPAddress(ip) {
  const splitArr = ip.split('.')
  const zeroArr = ['255', '255', '255', '255']
  const totalBitsOfIP = 4
  const firstBytesForNet = ipClass.find(i => i.key === getClassFromIPAdress(ip)).firstBytesForNet
  let res = splitArr.slice(0, firstBytesForNet).join('.')
  zeroArr.map((z, index) => {
    if (index < totalBitsOfIP - firstBytesForNet) {
      res += `.${z}`
    }
  })
  return res
}
function getValidUsableAdressOfIPAddress(ip) {
  const net = getNetAddressOfIPAddress(ip).split('.')
  const broadcast = getBroadcastAdressOfIPAddress(ip).split('.')
  net[3] = parseInt(net[3]) + 1
  broadcast[3] = parseInt(broadcast[3]) - 1
  return `${net.join('.')} - ${broadcast.join('.')}`
}

function showTable1(ip) {
  document.getElementById('table1').style.display = 'block'
  tableDataTds = document.querySelectorAll('#table1 td')
  const tableData = [
    { index: 0, content: ip => getClassFromIPAdress(ip) },
    { index: 1, content: ip => getNetAddressOfIPAddress(ip) },
    { index: 2, content: ip => getHostsInTheSameNetworkOfIPAddress(ip) },
    { index: 3, content: ip => getValidUsableAdressOfIPAddress(ip) },
    { index: 4, content: ip => getBroadcastAdressOfIPAddress(ip) }
  ]
  Array.from(tableDataTds).map((node, index) => {
    if (tableData[index] && tableData[index].content(ip)) {
      node.innerHTML = tableData[index].content(ip)
    }
  })
}
function validateForm() {
  var ip = document.forms["myForm"]["ip"].value.split('/')[0];
  if (ip == "") {
    alert("Fill in IP address");
    return false;
  }
  showTable1(ip)
}
const asyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      }
    };
  }
};
function listAllSubnets(ip, numberOfSubnets, borrowBit) {
  const ul = document.createElement('ul');
  let subnetCollection = []
  const thisClass = ipClass.find(i => i.key === getClassFromIPAdress(ip))
  for (let mem = 0; mem < numberOfSubnets; mem++) {
    const breakdownIp = ip.split('.')
    let content = breakdownIp
    let li = document.createElement('li')
    content[thisClass.firstBytesForNet] = getJumpStepOfSubnet(borrowBit) * mem
    subnetCollection.push(content)
    li.innerHTML += `Subnet ${mem + 1}: ${content.join('.')}`
    ul.appendChild(li)
  }
  return {
    content: ul.innerHTML,
    subnetCollection: subnetCollection
  }
}
function binaryToDecimal (bin) {
  return parseInt(`${bin}`, 2)
}
function listAllPossibleIPOfEachSubnet(ip, numberOfSubnets, borrowBit) {
  const { subnetCollection } = listAllSubnets(ip, numberOfSubnets, borrowBit)
  console.log("listAllPossibleIPOfEachSubnet -> subnetCollection", subnetCollection)
  const startingIndex = 4 - ipClass.find(i => getClassFromIPAdress(ip) === i.key).firstBytesForNet + 1
  const ul = document.createElement('ul');
  console.log("listAllPossibleIPOfEachSubnet -> subnetCollection", subnetCollection)
  for (let i = 0; i < subnetCollection.length - 1; i++) {
    let li = document.createElement('li')
    if (i === 0) {
      li.innerHTML = `Subnet ${i} : ${subnetCollection[i].join('.')}`
    } else {
      const startAddr = [...subnetCollection[i]]
      const endAddr = [...subnetCollection[i+1]]
      startAddr[startingIndex] = parseInt(subnetCollection[i][startingIndex]) + 1
      endAddr[2] -= 1
      endAddr[3] = binaryToDecimal(11111111) - 1
      li.innerHTML = `Subnet ${i} : ${startAddr.join('.')} - ${endAddr.join('.')}`
    }
    ul.appendChild(li)
  }
  return ul.innerHTML
}

function showTable2(ip, borrowBit) {
  document.getElementById('table2').style.display = 'block'
  tableDataTds = document.querySelectorAll('#table2 td')
  numberOfSubnets = getNumberOfChildSubnetsWhenBorrowFromNet(borrowBit).value
  const tableData = [
    {
      index: 0, content: ip => getClassFromIPAdress(ip)
    },
    {
      index: 1, content: borrowBit => getNumberOfChildSubnetsWhenBorrowFromNet(borrowBit)
    },
    {
      index: 2, content: (ip, numberOfSubnets, borrowBit) => listAllSubnets(ip, numberOfSubnets, borrowBit)
    },
    {
      index: 3, content: (ip, numberOfSubnets, borrowBit) => listAllPossibleIPOfEachSubnet(ip, numberOfSubnets, borrowBit)
    }
  ]
  Array.from(tableDataTds).forEachAsyncParallel(async (node, index) => {
    if (index === 1) {
      node.innerHTML = await tableData[index].content(borrowBit).asString
      return
    }
    else if (index === 2) {
      node.innerHTML = await tableData[index].content(ip, numberOfSubnets, borrowBit).content
      return
    } else if (index === 3) {
      node.innerHTML = await tableData[index].content(ip, numberOfSubnets, borrowBit)
      return
    } else if (index === 0) {
      node.innerHTML = await tableData[index].content(ip)
    }

  })
}

function validateForm1() {
  var ip = document.forms["myForm1"]["ip"].value.split('/')[0];
  var borrowedBits = document.forms["myForm1"]["borrowBit"].value;
  if (ip == "") {
    alert("Fill in IP address");
    return false;
  }
  if (borrowedBits == "") {
    alert("Fill in borrowed bits");
    return false;
  }
  showTable2(ip, borrowedBits)

}

/*
2. Chia subnets
Qui tac chia subnet
- Muon cac bit dau trong hostId lam netID
- so subnet = 2^n (n: so bit vay muon phan hostId)

case study:
Cong ty A duoc cap duong mmang la:
1!2.29.0.0/16. Cty muon chia thanh 10
subnet trong do co 3 subnet co 100 PCs, 4
subnet co 255 PCs, 3 subnet co 500 PCs

Solution:
10 < 2^4 => muon 4 bit cua phan HostId de chia subnet
- muon 4 bit o byte thu 3 cua dia chi IP => byte thu 3 con 4 bits
(1 byte = 8 bits)
- buoc nhay: 2^ (8-4) = 16
- Chia thanh 10 subnet:
Subnet

SUBNET      NET ADDR    HOSTIP                    BROADCAST
==================================================================
0000 0000  172.29.0.0   17229.0.1-172.29.15.254   17229.15255
------------------------------------------------------------------
0001 0000  172.29.16.0  172.29.16.1-172.29.81.254  172.29.31.255
------------------------------------------------------------------
0010 0000  172.29.32.0  172.29.32.1-172.29.47.254  172.29.47.255
------------------------------------------------------------------
0011 0000  172.29.48.0  172.29.48.1-172.29.63.254  172.29.63.255
------------------------------------------------------------------
0100 0000  172.29.64.0  172.29.48.1-172.29.79.254  17229.79.255
------------------------------------------------------------------
0101 0000  172.29.80.0  172.29.48.1-172.29.95.254  17229.95.255
...
==================================================================
subnet mask cua cac mang con: 16 + 4 = 20
*/
