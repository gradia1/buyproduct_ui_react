
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

function App() {
  const [product, setProduct] = useState([])
  const [order, setOrder] = useState([])

  const getUserData = async () => {


    const value = await axios.get("http://localhost:5178/api/product")
    console.log(value.data)
    setProduct(value.data)

  }

  useEffect(() => {
    getUserData();

  }, [])

  function reductProduct(productId) {

    console.log("productId")
    console.log(productId)
    const value = order.filter((item) => item.id == productId)

    console.log("ค่าที่กดมา")
    console.log(value)
    console.log(value[0].amount)
    if (value[0].amount == 1) {
      alert("ไม่สามารถลดได้แล้ว")
      return;
    }

    setOrder(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, amount: item.amount - 1 } : item
      )
    );


  }
  async function UpdateStock() {

    if (order.length == 0) {
      alert("ไม่ได้ซื้อสินค้า")
      return
    }
    var request = []

    for (let i = 0; i < order.length; i++) {
      request.push({
        Id: order[i].id,
        Amount: order[i].amount
      })

    }
    console.log(order)
    console.log("ดูค่า  request")
    console.log(request)

    let value = axios.post("http://localhost:5178/api/stock", request)


    alert("ซื้อเรียบร้อยแล้ว")

    //ดึงข้อมูลใหม่
    setOrder([])

    getUserData()




  }
  function DelOrder(productId) {

    var value = order.filter((item) => item.id != productId)
    setOrder(value)
  }


  async function BuyProduct(productId) {
    const value = product.filter((item) => item.id == productId)
    const ordervalue = order.filter((item) => item.id == productId)

    var leftInStock

    if (ordervalue.length > 0)
      leftInStock = (value[0].stock.amount - ordervalue[0].amount)
    else
      leftInStock = (value[0].stock.amount - 1)

    if (leftInStock <= 0) {
      alert("ไม่สามารถซื้อเพิ่มได้แล้ว")
      return
    }


    var oldvalue = null

    if (order.length != 0) {
      oldvalue = order.find((item) => item.id == productId)

    }

    console.log("old value")
    console.log(oldvalue)

    if (oldvalue) {
      console.log("have value")
      setOrder(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, amount: item.amount + 1 } : item
        )
      );

    }
    else {
      console.log("dont have value")
      console.log("value = " + value.name)
      setOrder([...order, {
        id: value[0].id,
        name: value[0].name,
        price: value[0].price,
        amount: 1
      }
      ])


    }
    console.log("after buy")
    console.log(order)
    //const value = await  axios.get("http://localhost:5178/api/stock/"+productId)
    //console.log(value)

  }

  return (
    <div>
      <div>รายการสินค้า</div>
      <table style={{ width: '100%' }}>
        <tr>
          <th style={{ width: '10%' }}>รหัส</th>
          <th style={{ width: '40%' }}>ชื่อ</th>
          <th style={{ width: '20%' }}>ราคา</th>
          <th style={{ width: '10%' }}>จำนวนที่มี</th>
          <th style={{ width: '20%' }}>ซื้อ</th>


        </tr>
        {product && product.map((item, index) => (
          <tr>
            <td style={{ textAlign: 'center' }} >{item.id}</td>
            <td>{item.name}</td>
            <td style={{ textAlign: 'right' }} >{item.price}</td>
            <td style={{ textAlign: 'right' }} >{item.stock.amount}</td>
            <td style={{ textAlign: 'center', cursor: 'pointer' }}><FaShoppingCart size={30} color="black" onClick={() => BuyProduct(item.id)} /></td>

          </tr>

        ))

        }
      </table>

      <div>รายการสินค้าที่สั่ง</div>
      {order.length == 0 ? <div>ไม่มีรายการสั่งสินค้า</div> : <div></div>}
      {order.length > 0 &&


        <table style={{ width: '100%' }}>
          <tr>
            <th style={{ width: '10%' }}>รหัส</th>
            <th style={{ width: '40%' }}>ชื่อ</th>
            <th style={{ width: '20%' }}>ราคา</th>
            <th style={{ width: '20%' }}>จำนวน</th>
            <th style={{ width: '20%' }}>ลด</th>
            <th style={{ width: '10%' }}>ลบ</th>
          </tr>

          {

            order && order.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.amount}</td>
                <td onClick={() => reductProduct(item.id)}>ลด</td>
                <td onClick={() => DelOrder(item.id)} style={{ cursor: 'pointer' }} >ลบ</td>
              </tr>
            ))

          }
        </table>
      }
      <button onClick={UpdateStock} style={{ width: '100%' }}>สั่งสินค้า</button>
    </div >

  );
}

export default App;
