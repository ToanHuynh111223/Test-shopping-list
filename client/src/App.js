import Button from '@mui/material/Button';
//add color Button in mui
import { purple } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';

function App() {
  let [itemShop, setItemShop] = useState('')
  const [listItemShop, setListItemShop] = useState([])
  const [totalItem, setTotalItem] = useState(0)
  // add color Button in mui
  const theme = createTheme({
    palette: {
      primary: {
        main: purple[400],
        light: purple[500],
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
    },
  });
  //get data
  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setListItemShop(data))
  }, [])
  // handle calculate total quantity
  useEffect(() => {
    const total = listItemShop.filter((item) => { return item.isSelected === false }).reduce((total, item) => { return total + item.quantity }, 0)
    setTotalItem(total)
  }, [listItemShop])

  //post data
  function postData(data) {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }


  // add item
  function handleAddItemShop() {
    // Prevent the end-user from entering duplicate item name.
    if (listItemShop) {
      listItemShop.forEach((item, index) => {
        if (itemShop) {
          if (itemShop.toLocaleUpperCase() === item.itemName.toLocaleUpperCase()) {
            alert("Nội dung này đã tồn tại!")
            setItemShop('')
            itemShop = ''
          }
        }
      })
    }
    //add
    if (itemShop) {
      let newItem = {
        itemName: itemShop,
        quantity: 1,
        isSelected: false,
      }
      const newItems = [...listItemShop, newItem]
      setListItemShop(newItems)
      setItemShop('')
      postData(newItem)
    }

  }

  // Toggle complete
  function toggleComplete(index) {
    const newItems = [...listItemShop];
    newItems[index].isSelected = !newItems[index].isSelected;
    setListItemShop(newItems)
  }
  // Increase quantity
  function handleIncreaseQuantum(index) {
    const newItems = [...listItemShop];
    newItems[index].quantity++
    setListItemShop(newItems)

  }
  // Decrease quantity
  function handleDecreaseQuantum(index) {
    const newItems = [...listItemShop];
    newItems[index].quantity--
    if (newItems[index].quantity <= 1) {
      newItems[index].quantity = 1
    }
    setListItemShop(newItems)
  }

  return (
    <div className='app-background'>
      <div className='main-container'>
        <form className='add-item-box' >
          <input className='add-item-input' placeholder='Add an item...' value={itemShop} onChange={(e) => { setItemShop(e.target.value) }} />
          <ThemeProvider theme={theme}>
            <Button variant="contained" size="small" color="primary" onClick={() => { handleAddItemShop() }}>add</Button>
          </ThemeProvider>
        </form>
        <div className='list-container'>
          <ul className='list-shopping'>
            {
              listItemShop.map((item, index) => {
                return (<li className='item-name' key={index} >
                  {item.isSelected ? (<span className='complete' onClick={() => toggleComplete(index)}>{item.itemName}</span>) : (<span onClick={() => toggleComplete(index)}>{item.itemName}</span>)}
                  <div className='quantity'>
                    <button onClick={() => { handleDecreaseQuantum(index) }}>
                      -
                    </button>
                    <span> {item.quantity} </span>
                    <button onClick={() => { handleIncreaseQuantum(index) }}>
                      +
                    </button>
                  </div>
                </li>)
              })
            }
          </ul>
        </div>
        <div className='total'>Total: {totalItem}</div>
      </div>
    </div>

  );
}

export default App;
