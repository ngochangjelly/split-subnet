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
function binaryToDecimal(bin) {
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
      const endAddr = [...subnetCollection[i + 1]]
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

const ipClassInfo = [
  {
    class: 'A', value: [
      {
        networkBits: 8,
        subnetMask: '255.0.0.0',
        bitsBorrowed: 0,
        subnets: 1,
        hostsInEachSubnet: 16777214
      },
      {
        networkBits: 9,
        subnetMask: '255.128.0.0',
        bitsBorrowed: 1,
        subnets: 2,
        hostsInEachSubnet: 8388606
      },
      {
        networkBits: 10,
        subnetMask: '255.192.0.0',
        bitsBorrowed: 2,
        subnets: 4,
        hostsInEachSubnet: 4194302
      },
      {
        networkBits: 11,
        subnetMask: '255.224.0.0',
        bitsBorrowed: 3,
        subnets: 8,
        hostsInEachSubnet: 2097150
      },
      {
        networkBits: 12,
        subnetMask: '255.240.0.0',
        bitsBorrowed: 4,
        subnets: 16,
        hostsInEachSubnet: 1048574
      },
      {
        networkBits: 13,
        subnetMask: '255.248.0.0',
        bitsBorrowed: 5,
        subnets: 32,
        hostsInEachSubnet: 524286
      }
      ,
      {
        networkBits: 14,
        subnetMask: '255.252.0.0',
        bitsBorrowed: 6,
        subnets: 64,
        hostsInEachSubnet: 262142
      },
      {
        networkBits: 15,
        subnetMask: '255.254.0.0',
        bitsBorrowed: 7,
        subnets: 128,
        hostsInEachSubnet: 131070
      },
      {
        networkBits: 16,
        subnetMask: '255.255.0.0',
        bitsBorrowed: 8,
        subnets: 256,
        hostsInEachSubnet: 65534
      },
      {
        networkBits: 17,
        subnetMask: '255.255.128.0',
        bitsBorrowed: 9,
        subnets: 512,
        hostsInEachSubnet: 32766
      },
      {
        networkBits: 18,
        subnetMask: '255.255.192.0',
        bitsBorrowed: 10,
        subnets: 1024,
        hostsInEachSubnet: 16382
      },
      {
        networkBits: 19,
        subnetMask: '255.255.224.0',
        bitsBorrowed: 11,
        subnets: 2048,
        hostsInEachSubnet: 8190
      },
      {
        networkBits: 20,
        subnetMask: '255.255.240.0',
        bitsBorrowed: 12,
        subnets: 4096,
        hostsInEachSubnet: 4094
      },
      {
        networkBits: 21,
        subnetMask: '255.255.248.0',
        bitsBorrowed: 13,
        subnets: 8192,
        hostsInEachSubnet: 2046
      },
      {
        networkBits: 22,
        subnetMask: '255.255.252.0',
        bitsBorrowed: 14,
        subnets: 16384,
        hostsInEachSubnet: 1022
      },
      {
        networkBits: 23,
        subnetMask: '255.255.254.0',
        bitsBorrowed: 15,
        subnets: 32768,
        hostsInEachSubnet: 510
      },
      {
        networkBits: 24,
        subnetMask: '255.255.255.0',
        bitsBorrowed: 16,
        subnets: 65536,
        hostsInEachSubnet: 254
      },
      {
        networkBits: 25,
        subnetMask: '255.255.255.128',
        bitsBorrowed: 17,
        subnets: 131072,
        hostsInEachSubnet: 126
      },
      {
        networkBits: 26,
        subnetMask: '255.255.255.192',
        bitsBorrowed: 18,
        subnets: 262144,
        hostsInEachSubnet: 62
      },
      {
        networkBits: 27,
        subnetMask: '255.255.255.224',
        bitsBorrowed: 19,
        subnets: 524288,
        hostsInEachSubnet: 30
      },
      {
        networkBits: 28,
        subnetMask: '255.255.255.240',
        bitsBorrowed: 20,
        subnets: 1048576,
        hostsInEachSubnet: 14
      },
      {
        networkBits: 29,
        subnetMask: '255.255.255.248',
        bitsBorrowed: 21,
        subnets: 2097152,
        hostsInEachSubnet: 6
      },
      {
        networkBits: 30,
        subnetMask: '255.255.255.252',
        bitsBorrowed: 22,
        subnets: 4194304,
        hostsInEachSubnet: 2
      }
    ]
  },
  {
    class: 'B', value: [
      {
        networkBits: 16,
        subnetMask: '255.255.0.0',
        bitsBorrowed: 0,
        subnets: 0,
        hostsInEachSubnet: 65534
      },
      {
        networkBits: 17,
        subnetMask: '255.255.128.0',
        bitsBorrowed: 1,
        subnets: 2,
        hostsInEachSubnet: 32766
      },
      {
        networkBits: 18,
        subnetMask: '255.255.192.0',
        bitsBorrowed: 2,
        subnets: 4,
        hostsInEachSubnet: 16382
      },
      {
        networkBits: 19,
        subnetMask: '255.255.224.0',
        bitsBorrowed: 3,
        subnets: 8,
        hostsInEachSubnet: 8190
      },
      {
        networkBits: 20,
        subnetMask: '255.255.240.0',
        bitsBorrowed: 4,
        subnets: 16,
        hostsInEachSubnet: 4094
      },
      {
        networkBits: 21,
        subnetMask: '255.255.248.0',
        bitsBorrowed: 5,
        subnets: 32,
        hostsInEachSubnet: 2046
      },
      {
        networkBits: 22,
        subnetMask: '255.255.252.0',
        bitsBorrowed: 6,
        subnets: 64,
        hostsInEachSubnet: 1022
      },
      {
        networkBits: 23,
        subnetMask: '255.255.254.0',
        bitsBorrowed: 7,
        subnets: 128,
        hostsInEachSubnet: 510
      },
      {
        networkBits: 24,
        subnetMask: '255.255.255.0',
        bitsBorrowed: 8,
        subnets: 256,
        hostsInEachSubnet: 254
      },
      {
        networkBits: 25,
        subnetMask: '255.255.255.128',
        bitsBorrowed: 9,
        subnets: 512,
        hostsInEachSubnet: 126
      },
      {
        networkBits: 26,
        subnetMask: '255.255.255.192',
        bitsBorrowed: 10,
        subnets: 1024,
        hostsInEachSubnet: 62
      },
      {
        networkBits: 27,
        subnetMask: '255.255.255.224',
        bitsBorrowed: 11,
        subnets: 2048,
        hostsInEachSubnet: 30
      },
      {
        networkBits: 28,
        subnetMask: '255.255.255.240',
        bitsBorrowed: 12,
        subnets: 4096,
        hostsInEachSubnet: 14
      },
      {
        networkBits: 29,
        subnetMask: '255.255.255.248',
        bitsBorrowed: 13,
        subnets: 8192,
        hostsInEachSubnet: 6
      },
      {
        networkBits: 30,
        subnetMask: '255.255.255.252',
        bitsBorrowed: 14,
        subnets: 16384,
        hostsInEachSubnet: 2
      }
    ]
  },
  {
    class: 'C', value: [
      {
        networkBits: 24,
        subnetMask: '255.255.255.0',
        bitsBorrowed: 0,
        subnets: 1,
        hostsInEachSubnet: 254
      },
      {
        networkBits: 25,
        subnetMask: '255.255.255.128',
        bitsBorrowed: 2,
        subnets: 512,
        hostsInEachSubnet: 126
      },
      {
        networkBits: 26,
        subnetMask: '255.255.255.192',
        bitsBorrowed: 2,
        subnets: 4,
        hostsInEachSubnet: 62
      },
      {
        networkBits: 27,
        subnetMask: '255.255.255.224',
        bitsBorrowed: 3,
        subnets: 8,
        hostsInEachSubnet: 30
      },
      {
        networkBits: 28,
        subnetMask: '255.255.255.240',
        bitsBorrowed: 4,
        subnets: 16,
        hostsInEachSubnet: 14
      },
      {
        networkBits: 29,
        subnetMask: '255.255.255.248',
        bitsBorrowed: 5,
        subnets: 32,
        hostsInEachSubnet: 6
      },
      {
        networkBits: 30,
        subnetMask: '255.255.255.252',
        bitsBorrowed: 6,
        subnets: 64,
        hostsInEachSubnet: 2
      }
    ]
  }
]
function identifyWhichSubnetThisAddressBelongTo(ip, bitsInNetsId) {
  // const result = ipClassInfo.find(i => i[getClassFromIPAdress(ip)].value.networkBits === bitsInNetsId)
  const classObj = ipClassInfo.find(i => i.class === getClassFromIPAdress(ip))
  console.log("identifyWhichSubnetThisAddressBelongTo -> classObj", classObj.value)
  const subnet = classObj.value.find(i => i.networkBits == bitsInNetsId)
 const numberOfSubnets = subnet.subnets
 const {subnetCollection} = listAllSubnets(ip, numberOfSubnets, subnet.bitsBorrowed)
 console.log("identifyWhichSubnetThisAddressBelongTo -> allSubnets", subnetCollection)
  return subnet
}
function showTable3(ip, bitsInNetsId) {
  document.getElementById('table3').style.display = 'block'
  tableDataTds = document.querySelectorAll('#table3 td')
  const tableData = [
    {
      index: 0, content: ip => getClassFromIPAdress(ip)
    },
    {
      index: 1, content: (ip, bitsInNetsId) => identifyWhichSubnetThisAddressBelongTo(ip, bitsInNetsId)
    }
  ]
  Array.from(tableDataTds).forEachAsyncParallel(async (node, index) => {
    if (index === 0) {
      node.innerHTML = tableData[index].content(ip)
    }
    if (index === 1) {
      node.innerHTML = await tableData[index].content(ip, bitsInNetsId)
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
function validateForm2() {
  var ip = document.forms["myForm2"]["ip"].value.split('/')[0];
  console.log("ip", ip)
  var bitsInNetsId = document.forms["myForm2"]["bitsInNetsId"].value;
  if (ip == "") {
    alert("Fill in IP address");
    return false;
  }
  if (bitsInNetsId == "") {
    alert("Fill in bitsInNetsId number");
    return false;
  }
  showTable3(ip, bitsInNetsId)

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
